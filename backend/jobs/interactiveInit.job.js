import Project from "../models/Project.js";
import serpService from "../services/serpService.js";
import logger from "../utils/winstonLogger.util.js";

export const executeInteractiveInit = async (job, projectId, patentId) => {
  console.log(`[Job ${job.id}] 🔍 Fetching: ${patentId}`);
  logger.info(`[Job ${job.id}] 🔍 Fetching: ${patentId}`);

  try {
    const patentData = await serpService.fetchPatentDetails(patentId);

    // 1. Attempt to get claims from multiple sources
    let rawClaims =
      patentData?.claims?.all || patentData?.rawData?.claims || [];

    // 🟢 FALLBACK: If claims are empty, check if they are buried in the description
    if (rawClaims.length === 0 && patentData.fullDescription) {
      console.log("Claims array empty, searching in description text...");

      logger.error("Claims array empty, searching in description text...");
      // This regex looks for lines starting with numbers (e.g., "1. A method...")
      const descriptionClaims = patentData.fullDescription.match(
        /\d+\.\s+.*?(?=\s\d+\.\s|$)/gs,
      );
      if (descriptionClaims) rawClaims = descriptionClaims;
    }

    const formattedClaims = rawClaims
      .map((text, index) => {
        const claimText = typeof text === "string" ? text : text.text || "";
        return {
          number: index + 1,
          text: claimText.trim(),
          isIndependent: !claimText.toLowerCase().match(/claim\s+\d+/),
        };
      })
      .filter((c) => c.text.length > 15); // Ensure they are real claims

    // 🛑 VALIDATION
    if (formattedClaims.length === 0) {
      throw new Error(
        `ValidationFailed: No claims could be extracted for ${patentId}. Please try a 'B2' (Grant) patent or a different ID.`,
      );
    }

    const description =
      patentData.fullDescription?.length > 100
        ? patentData.fullDescription
        : "Insufficient description found.";

    // 2. Persist to Database
    await Project.findByIdAndUpdate(projectId, {
      $set: {
        allClaims: formattedClaims,
        "patentData.fullDescription": description,
        "patentData.biblioData": patentData.biblioData,
        currentStep: "claimSelection",
        progress: 100,
      },
    });

    console.log(
      `✅ [Job ${job.id}] Extracted ${formattedClaims.length} claims.`,
    );
    logger.info(
      `✅ [Job ${job.id}] Extracted ${formattedClaims.length} claims.`,
    );
    return { success: true };
  } catch (error) {
    console.error(`❌ [Job ${job.id}] failed:`, error.message);
    logger.error(`❌ [Job ${job.id}] failed:`, error.message);
    throw error;
  }
};
