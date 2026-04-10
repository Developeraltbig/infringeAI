import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import serpService from "../services/serpService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";
import { analysisQueue } from "../config/queue.config.js";
import logger from "../utils/winstonLogger.util.js";

/**
 * Phase 1: Patent Data Extraction & Product Discovery
 */
export const executeQuickAnalysis = async (job, projectId, patentId) => {
  const logPrefix = `[Job ${job.id}][${patentId}]`;

  try {
    // 0. Fetch project to check mode
    const project = await Project.findById(projectId);
    if (!project) throw new Error("Project not found in database.");

    // 1. Fetch & Resiliently Extract Patent Details
    console.log(`${logPrefix} Fetching patent details...`);
    const patentData = await serpService.fetchPatentDetails(patentId);

    let firstClaimText =
      patentData?.claims?.firstClaim?.text ||
      patentData?.claims?.all?.[0] ||
      "";
    if (!firstClaimText) throw new Error("ValidationFailed: No claims found");

    // 2. AI: Generate PCR (Understanding the Patent)
    console.log(`${logPrefix} Calling Gemini for PCR...`);
    const pcrPrompt = promptTemplates.pcrPrompt(
      firstClaimText,
      patentData.fullDescription,
    );
    const pcrResponse = await aiService.generateResponse(pcrPrompt);

    const pcrResult = safeJsonParse(pcrResponse, {
      fallbackValue: { claimReading: [] },
    });
    const pcrData = pcrResult.claimReading || [];

    // Save First Phase Progress
    await Project.findByIdAndUpdate(projectId, {
      progress: 40,
      currentStep: "quickAnalysis",
      "patentData.firstClaim": firstClaimText,
      "patentData.fullDescription": patentData.fullDescription,
      "patentData.biblioData": patentData.biblioData,
      "results.pcrAnalysis": pcrData,
    });

    // 🔴 INTERACTIVE MODE STOP POINT (Stage 1: Claim Selection)
    // If you want the user to pick a claim manually first:

    if (project.mode === "interactive" && !project.selectedClaim) {
      await Project.findByIdAndUpdate(projectId, {
        currentStep: "claimSelection",
        progress: 100,
      });
      return { success: true, paused: true };
    }

    // 3. AI: Discover 20-50 Potential Infringing Companies
    console.log(`${logPrefix} Calling Gemini for Product/Company Discovery...`);
    const discoveryPrompt = promptTemplates.quickModeDiscovery20Prompt(
      firstClaimText,
      pcrData,
      patentData.biblioData,
    );
    const discoveryResponse = await aiService.generateResponse(discoveryPrompt);
    const discoveryData = safeJsonParse(discoveryResponse, {
      fallbackValue: { candidates: [] },
    });

    // 🟢 NORMALIZATION: Fix the "undefined" company name bug
    // This ensures keys match regardless of AI output variations
    const normalizedCandidates = (discoveryData.candidates || []).map(
      (item) => {
        const company =
          item.company ||
          item.name ||
          item.manufacturer ||
          item.organization ||
          "Unknown Company";
        const product =
          item.product || item.brand || item.service || "Unknown Product";

        return {
          company: company.trim(),
          product: product.trim(),
          description: item.description || item.reasoning || "",
        };
      },
    );

    if (normalizedCandidates.length === 0) {
      throw new Error(
        "ValidationFailed: AI could not identify any target companies.",
      );
    }

    // 🔴 INTERACTIVE MODE STOP POINT (Stage 2: Target Selection)
    if (project.mode === "interactive") {
      console.log(`${logPrefix} Interactive Mode: Pausing for user selection.`);
      await Project.findByIdAndUpdate(projectId, {
        allDiscoveredProducts: normalizedCandidates,
        currentStep: "targetSelection",
        progress: 100,
      });
      return { success: true, paused: true };
    }

    // 🔵 QUICK / BULK MODE: Auto-pick top 5 and proceed
    const top5 = normalizedCandidates.slice(0, 5);

    // 4. Update Database before spawning sub-jobs
    await Project.findByIdAndUpdate(projectId, {
      progress: 60,
      currentStep: "productProcessing",
      quickModeProducts: top5.map((p) => p.product),
      allDiscoveredProducts: normalizedCandidates,
    });

    // 5. Spawn Sub-jobs for Deep Analysis
    console.log(
      `${logPrefix} Spawning ${top5.length} product-analysis jobs...`,
    );
    for (const prod of top5) {
      await analysisQueue.add("product-analysis", {
        projectId,
        patentId,
        productName: prod.product,
        companyName: prod.company, // 🟢 Now guaranteed to be defined
        type: "product-analysis",
      });
    }

    await job.updateProgress(100);
    return { success: true, mode: project.mode };
  } catch (error) {
    console.error(`${logPrefix} ❌ Error:`, error.message);
    logger.error(`${logPrefix} ❌ Error: ${error.message}`);
    throw error;
  }
};
