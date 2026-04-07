// import Project from "../models/Project.js";
// import aiService from "../services/aiService.js";
// import serpService from "../services/serpService.js";
// import { promptTemplates } from "../utils/promptTemplates.js";
// import { safeJsonParse } from "../utils/safeJsonParser.js";
// import { analysisQueue } from "../config/queue.config.js";

// export const executeQuickAnalysis = async (job, projectId, patentId) => {
//   console.log(
//     `[Job ${job.id}] 🚀 Starting Resilient Quick Analysis: ${patentId}`,
//   );

//   // 1. Fetch initial project
//   const project = await Project.findById(projectId);
//   if (!project) throw new Error("Project not found in database.");

//   try {
//     // ==========================================
//     // STEP 1: Fetch & Resiliently Extract Data
//     // ==========================================
//     await job.updateProgress(10);
//     const patentData = await serpService.fetchPatentDetails(patentId);

//     let firstClaimText = "";

//     // logic to find the text no matter where it is hiding in the API response
//     if (patentData?.claims?.firstClaim?.text) {
//       firstClaimText = patentData.claims.firstClaim.text;
//     } else if (typeof patentData?.claims?.firstClaim === "string") {
//       firstClaimText = patentData.claims.firstClaim;
//     } else if (
//       Array.isArray(patentData?.claims?.all) &&
//       patentData.claims.all.length > 0
//     ) {
//       firstClaimText =
//         typeof patentData.claims.all[0] === "string"
//           ? patentData.claims.all[0]
//           : patentData.claims.all[0].text;
//     } else if (
//       Array.isArray(patentData?.rawData?.claims) &&
//       patentData.rawData.claims.length > 0
//     ) {
//       firstClaimText = patentData.rawData.claims[0];
//     }

//     const fullDescription = patentData?.fullDescription || "";

//     // 🛑 VALIDATION GUARD
//     if (!firstClaimText || firstClaimText.length < 10) {
//       console.error(
//         `[Job ${job.id}] Failed to extract claim. Raw structure:`,
//         JSON.stringify(patentData?.claims),
//       );
//       throw new Error(
//         "ValidationFailed: Patent claim text is missing or unreadable from source.",
//       );
//     }

//     if (!fullDescription || fullDescription.length < 100) {
//       throw new Error(
//         "ValidationFailed: Patent description is missing or too short.",
//       );
//     }

//     console.log(
//       `[Job ${job.id}] Data Extracted Successfully. Claim Length: ${firstClaimText.length}`,
//     );

//     // ==========================================
//     // STEP 2: Generate PCR (Claim Analysis)
//     // ==========================================
//     console.log(`[Job ${job.id}] Generating PCR Analysis...`);
//     const pcrPrompt = promptTemplates.pcrPrompt(
//       firstClaimText,
//       fullDescription,
//     );
//     const pcrResponse = await aiService.generateResponse(pcrPrompt);

//     const pcrParsed = safeJsonParse(pcrResponse, {
//       fallbackValue: { claimReading: [] },
//     });
//     const pcrResult = pcrParsed.claimReading || [];

//     // Save First Phase Results
//     await Project.findByIdAndUpdate(projectId, {
//       currentStep: "quickAnalysis",
//       progress: 30,
//       "patentData.firstClaim": firstClaimText,
//       "patentData.fullDescription": fullDescription,
//       "patentData.biblioData": patentData.biblioData,
//       "results.pcrAnalysis": pcrResult,
//     });
//     await job.updateProgress(40);

//     // ==========================================
//     // STEP 3: Discover Products (Top 20)
//     // ==========================================
//     console.log(`[Job ${job.id}] Discovering target products...`);
//     const discoveryPrompt = promptTemplates.quickModeDiscovery20Prompt(
//       firstClaimText,
//       pcrResult,
//       patentData.biblioData,
//     );
//     const discoveryResponse = await aiService.generateResponse(discoveryPrompt);

//     const discoveryParsed = safeJsonParse(discoveryResponse, {
//       fallbackValue: { candidates: [] },
//     });

//     const candidates = (discoveryParsed.candidates || []).map((item) => ({
//       product: typeof item === "string" ? item : item.product,
//       company: item.company || "TBD",
//       description: item.description || "",
//     }));

//     if (candidates.length === 0) {
//       throw new Error(
//         "ValidationFailed: AI could not find any infringing products for this patent.",
//       );
//     }

//     // Pick top 5 for parallel deep analysis
//     const finalProducts = candidates.slice(0, 5);

//     await Project.findByIdAndUpdate(projectId, {
//       progress: 60,
//       currentStep: "productProcessing",
//       quickModeProducts: finalProducts.map((p) => p.product),
//       allDiscoveredProducts: candidates,
//     });
//     await job.updateProgress(70);

//     // ==========================================
//     // STEP 4: Spawn Sub-Jobs for Parallelism
//     // ==========================================
//     console.log(
//       `[Job ${job.id}] Spawning ${finalProducts.length} parallel product jobs...`,
//     );

//     for (const prod of finalProducts) {
//       await analysisQueue.add("product-analysis", {
//         projectId,
//         patentId,
//         productName: prod.product,
//         type: "product-analysis",
//       });
//     }

//     await job.updateProgress(100);
//     console.log(`✅ [Job ${job.id}] Quick Analysis Phase Finished.`);

//     return { success: true, count: finalProducts.length };
//   } catch (error) {
//     console.error(`[Job ${job.id}] Error: ${error.message}`);
//     throw error; // Let BullMQ worker handle the failure/retry
//   }
// };

import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import serpService from "../services/serpService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";
import { analysisQueue } from "../config/queue.config.js";

export const executeQuickAnalysis = async (job, projectId, patentId) => {
  try {
    // 1. Fetch & Extract
    const patentData = await serpService.fetchPatentDetails(patentId);
    let firstClaimText =
      patentData?.claims?.firstClaim?.text ||
      patentData?.claims?.all?.[0] ||
      "";

    if (!firstClaimText) throw new Error("ValidationFailed: No claims found");

    // 2. AI: Generate PCR
    console.log(`[Job ${job.id}] Calling Gemini for PCR...`);

    const pcrPrompt = promptTemplates.pcrPrompt(
      firstClaimText,
      patentData.fullDescription,
    );
    const pcrResponse = await aiService.generateResponse(pcrPrompt);
    const pcrResult = safeJsonParse(pcrResponse, {
      fallbackValue: { claimReading: [] },
    });

    // UPDATE PROGRESS
    await Project.findByIdAndUpdate(projectId, {
      progress: 40,
      currentStep: "quickAnalysis",
      "patentData.firstClaim": firstClaimText,
      "results.pcrAnalysis": pcrResult.claimReading,
    });

    // 3. AI: Discover Products
    console.log(`[Job ${job.id}] Calling Gemini for Discovery...`);
    const discoveryPrompt = promptTemplates.quickModeDiscovery20Prompt(
      firstClaimText,
      pcrResult.claimReading,
    );
    const discoveryResponse = await aiService.generateResponse(discoveryPrompt);
    const discoveryData = safeJsonParse(discoveryResponse, {
      fallbackValue: { candidates: [] },
    });

    const top5 = discoveryData.candidates.slice(0, 5);

    // 4. Update Database
    await Project.findByIdAndUpdate(projectId, {
      progress: 70,
      currentStep: "productProcessing",
      quickModeProducts: top5.map((p) => p.product),
      allDiscoveredProducts: discoveryData.candidates,
    });

    // 5. Spawn Sub-jobs
    for (const prod of top5) {
      await analysisQueue.add("product-analysis", {
        projectId,
        patentId,
        productName: prod.product,
        companyName: prod.company,
        type: "product-analysis",
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Quick Analysis Job Error:", error.message);
    throw error;
  }
};
