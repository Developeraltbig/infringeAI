// import Project from "../models/Project.js";
// import serpService from "../services/serpService.js";
// import aiService from "../services/aiService.js";
// import exaService from "../services/exaService.js";
// import { promptTemplates } from "../utils/promptTemplates.js";
// import { safeJsonParse } from "../utils/safeJsonParser.js";
// import { analysisQueue } from "../config/queue.config.js"; // To spawn the next jobs
// import logger from "../utils/winstonLogger.util.js";
// import ApiError from "../utils/apiError.util.js";

// export const executeQuickAnalysis = async (job, projectId, patentId) => {
//   logger.info(
//     `[Job ${job.id}] Starting Quick Analysis Pipeline for ${patentId}`,
//   );

//   // Fetch the current project state from MongoDB
//   // We do this to see if we already completed some steps in a previous failed attempt
//   let project = await Project.findById(projectId);
//   if (!project) throw new ApiError(404, "Project not found in database.");

//   await job.updateProgress(5);

//   // ==========================================
//   // STEP 1: Fetch & Validate SERP Data
//   // ==========================================
//   if (!project.patentData?.fullDescription) {
//     logger.info(`[Job ${job.id}] Step 1: Fetching SERP Data...`);
//     const patentData = await serpService.fetchPatentDetails(patentId);

//     // Strict Validation
//     if (
//       !patentData?.claims?.firstClaim ||
//       !patentData?.fullDescription ||
//       patentData.fullDescription.length < 100
//     ) {
//       ApiError(400, "Invalid or unavailable patent data.");
//     }

//     // Save to Database
//     project = await Project.findByIdAndUpdate(
//       projectId,
//       {
//         "patentData.firstClaim": patentData.claims.firstClaim?.text || "",
//         "patentData.fullDescription": patentData.fullDescription || "",
//         "patentData.biblioData": patentData.biblioData,
//       },
//       { new: true },
//     );
//   }

//   await job.updateProgress(15);

//   // ==========================================
//   // STEP 2: PCR Analysis
//   // ==========================================
//   if (!project.results?.pcrAnalysis) {
//     logger.info(`[Job ${job.id}] Step 2: Generating PCR Analysis...`);

//     const pcrPrompt = promptTemplates.pcrPrompt(
//       project.patentData.firstClaim,
//       project.patentData.fullDescription,
//     );
//     const pcrResponse = await aiService.generateResponse(pcrPrompt);

//     const parsedData = safeJsonParse(pcrResponse, {
//       fallbackValue: { claimReading: [] },
//     });

//     project = await Project.findByIdAndUpdate(
//       projectId,
//       {
//         "results.pcrAnalysis": parsedData.claimReading,
//         currentStep: "quickAnalysis",
//       },
//       { new: true },
//     );
//   }

//   await job.updateProgress(30);

//   // ==========================================
//   // STEP 3: Discovery (Find 20 Candidates)
//   // ==========================================
//   // We use allDiscoveredProducts array to check if this is done
//   if (
//     !project.allDiscoveredProducts ||
//     project.allDiscoveredProducts.length === 0
//   ) {
//     logger.info(`[Job ${job.id}] Step 3: Discovering 20 Candidates...`);

//     const discoveryPrompt = promptTemplates.quickModeDiscovery20Prompt(
//       project.patentData.firstClaim,
//       project.results.pcrAnalysis,
//       project.patentData.biblioData,
//     );

//     const response = await aiService.generateResponse(discoveryPrompt);
//     const parsedData = safeJsonParse(response, {
//       fallbackValue: { candidates: [] },
//     });

//     if (!parsedData.candidates || parsedData.candidates.length !== 20) {
//       throw new ApiError(
//         400,
//         `AI generated ${parsedData.candidates?.length} candidates instead of 20.`,
//       );
//     }

//     // Format the candidates
//     const candidatesArray = parsedData.candidates.map((item) => ({
//       product: typeof item === "string" ? item : item.product,
//       company: "TBD",
//       description: typeof item === "string" ? "" : item.description || "",
//     }));

//     project = await Project.findByIdAndUpdate(
//       projectId,
//       {
//         allDiscoveredProducts: candidatesArray,
//       },
//       { new: true },
//     );
//   }

//   await job.updateProgress(50);

//   // ==========================================
//   // STEP 4: Exa Highlight Searches for the 20 Candidates
//   // ==========================================
//   // Note: We temporarily store snippets in the DB to avoid re-fetching if it crashes
//   if (!project.results?.quickAnalysisDetails?.snippetsCompleted) {
//     console.log(`[Job ${job.id}] Step 4: Exa Highlight Searches...`);

//     const candidatesWithSnippets = [];

//     for (const candidate of project.allDiscoveredProducts) {
//       const highlightPrompt = promptTemplates.quickModeHighlightPrompt(
//         candidate.product,
//         project.patentData.firstClaim,
//       );

//       const queryResponse = await aiService.generateResponse(highlightPrompt);
//       const parsed = safeJsonParse(queryResponse, {
//         fallbackValue: { queries: [] },
//       });
//       const queries = parsed.queries || [`${candidate.product} features`];

//       const allHighlights = [];
//       for (const query of queries) {
//         const highlights = await exaService.searchWithHighlights(query);
//         allHighlights.push(...highlights);
//         await new Promise((resolve) => setTimeout(resolve, 500)); // Respect API Rate Limits
//       }

//       candidatesWithSnippets.push({
//         product: candidate.product,
//         company: "Unknown", // Let AI figure it out in next step
//         snippets: exaService.deduplicateResults(allHighlights).slice(0, 5),
//       });
//     }

//     // We store this temporarily in results
//     project = await Project.findByIdAndUpdate(
//       projectId,
//       {
//         "results.quickAnalysisDetails.tempSnippets": candidatesWithSnippets,
//         "results.quickAnalysisDetails.snippetsCompleted": true,
//       },
//       { new: true },
//     );
//   }

//   await job.updateProgress(75);

//   // ==========================================
//   // STEP 5: Select Final 5 Products
//   // ==========================================
//   if (!project.quickModeProducts || project.quickModeProducts.length === 0) {
//     logger.info(`[Job ${job.id}] Step 5: Selecting Final 5 Products...`);

//     const snippetsData = JSON.stringify(
//       project.results.quickAnalysisDetails.tempSnippets,
//     );
//     const selectionPrompt = promptTemplates.quickModeSelectTop5Prompt(
//       project.patentData.firstClaim,
//       snippetsData,
//     );

//     const response = await aiService.generateResponse(selectionPrompt);
//     const parsedData = safeJsonParse(response, {
//       fallbackValue: { finalProducts: [] },
//     });

//     if (!parsedData.finalProducts || parsedData.finalProducts.length !== 5) {
//       throw new ApiError(400, "AI failed to select exactly 5 products.");
//     }

//     const finalProducts = parsedData.finalProducts.map((p) => p.product);

//     // Cleanup temp snippets and save final selection
//     project = await Project.findByIdAndUpdate(
//       projectId,
//       {
//         $unset: { "results.quickAnalysisDetails.tempSnippets": 1 }, // Delete temp data
//         quickModeProducts: finalProducts,
//         "results.productAnalysis": { results: parsedData.finalProducts },
//         currentStep: "productProcessing",
//       },
//       { new: true },
//     );
//   }

//   await job.updateProgress(90);

//   // ==========================================
//   // STEP 6: Spawn the Sub-Jobs! (Parallelism)
//   // ==========================================
//   logger.info(`[Job ${job.id}] Step 6: Spawning 5 Product Analysis Jobs...`);

//   const jobsToSpawn = project.quickModeProducts.map((productName) => ({
//     name: "product-analysis", // Name of the job
//     data: {
//       projectId: projectId,
//       patentId: patentId,
//       productName: productName,
//       type: "product-analysis",
//     },
//   }));

//   // BullMQ allows us to add multiple jobs to the queue at once!
//   await analysisQueue.addBulk(jobsToSpawn);

//   await job.updateProgress(100);

//   logger.info(
//     `[Job ${job.id}] Quick Analysis Pipeline Complete! 5 sub-jobs queued.`,
//   );
//   return {
//     success: true,
//     message: "Top 5 products selected and queued for deep analysis.",
//   };
// };

import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import serpService from "../services/serpService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";
import { analysisQueue } from "../config/queue.config.js";

export const executeQuickAnalysis = async (job, projectId, patentId) => {
  console.log(
    `[Job ${job.id}] 🚀 Starting Resilient Quick Analysis: ${patentId}`,
  );

  // 1. Fetch initial project
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found in database.");

  try {
    // ==========================================
    // STEP 1: Fetch & Resiliently Extract Data
    // ==========================================
    await job.updateProgress(10);
    const patentData = await serpService.fetchPatentDetails(patentId);

    let firstClaimText = "";

    // logic to find the text no matter where it is hiding in the API response
    if (patentData?.claims?.firstClaim?.text) {
      firstClaimText = patentData.claims.firstClaim.text;
    } else if (typeof patentData?.claims?.firstClaim === "string") {
      firstClaimText = patentData.claims.firstClaim;
    } else if (
      Array.isArray(patentData?.claims?.all) &&
      patentData.claims.all.length > 0
    ) {
      firstClaimText =
        typeof patentData.claims.all[0] === "string"
          ? patentData.claims.all[0]
          : patentData.claims.all[0].text;
    } else if (
      Array.isArray(patentData?.rawData?.claims) &&
      patentData.rawData.claims.length > 0
    ) {
      firstClaimText = patentData.rawData.claims[0];
    }

    const fullDescription = patentData?.fullDescription || "";

    // 🛑 VALIDATION GUARD
    if (!firstClaimText || firstClaimText.length < 10) {
      console.error(
        `[Job ${job.id}] Failed to extract claim. Raw structure:`,
        JSON.stringify(patentData?.claims),
      );
      throw new Error(
        "ValidationFailed: Patent claim text is missing or unreadable from source.",
      );
    }

    if (!fullDescription || fullDescription.length < 100) {
      throw new Error(
        "ValidationFailed: Patent description is missing or too short.",
      );
    }

    console.log(
      `[Job ${job.id}] Data Extracted Successfully. Claim Length: ${firstClaimText.length}`,
    );

    // ==========================================
    // STEP 2: Generate PCR (Claim Analysis)
    // ==========================================
    console.log(`[Job ${job.id}] Generating PCR Analysis...`);
    const pcrPrompt = promptTemplates.pcrPrompt(
      firstClaimText,
      fullDescription,
    );
    const pcrResponse = await aiService.generateResponse(pcrPrompt);

    const pcrParsed = safeJsonParse(pcrResponse, {
      fallbackValue: { claimReading: [] },
    });
    const pcrResult = pcrParsed.claimReading || [];

    // Save First Phase Results
    await Project.findByIdAndUpdate(projectId, {
      currentStep: "quickAnalysis",
      progress: 30,
      "patentData.firstClaim": firstClaimText,
      "patentData.fullDescription": fullDescription,
      "patentData.biblioData": patentData.biblioData,
      "results.pcrAnalysis": pcrResult,
    });
    await job.updateProgress(40);

    // ==========================================
    // STEP 3: Discover Products (Top 20)
    // ==========================================
    console.log(`[Job ${job.id}] Discovering target products...`);
    const discoveryPrompt = promptTemplates.quickModeDiscovery20Prompt(
      firstClaimText,
      pcrResult,
      patentData.biblioData,
    );
    const discoveryResponse = await aiService.generateResponse(discoveryPrompt);

    const discoveryParsed = safeJsonParse(discoveryResponse, {
      fallbackValue: { candidates: [] },
    });

    const candidates = (discoveryParsed.candidates || []).map((item) => ({
      product: typeof item === "string" ? item : item.product,
      company: item.company || "TBD",
      description: item.description || "",
    }));

    if (candidates.length === 0) {
      throw new Error(
        "ValidationFailed: AI could not find any infringing products for this patent.",
      );
    }

    // Pick top 5 for parallel deep analysis
    const finalProducts = candidates.slice(0, 5);

    await Project.findByIdAndUpdate(projectId, {
      progress: 60,
      currentStep: "productProcessing",
      quickModeProducts: finalProducts.map((p) => p.product),
      allDiscoveredProducts: candidates,
    });
    await job.updateProgress(70);

    // ==========================================
    // STEP 4: Spawn Sub-Jobs for Parallelism
    // ==========================================
    console.log(
      `[Job ${job.id}] Spawning ${finalProducts.length} parallel product jobs...`,
    );

    for (const prod of finalProducts) {
      await analysisQueue.add("product-analysis", {
        projectId,
        patentId,
        productName: prod.product,
        type: "product-analysis",
      });
    }

    await job.updateProgress(100);
    console.log(`✅ [Job ${job.id}] Quick Analysis Phase Finished.`);

    return { success: true, count: finalProducts.length };
  } catch (error) {
    console.error(`[Job ${job.id}] Error: ${error.message}`);
    throw error; // Let BullMQ worker handle the failure/retry
  }
};
