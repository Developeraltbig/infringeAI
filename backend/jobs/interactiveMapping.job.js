import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";
import logger from "../utils/winstonLogger.util.js";

export const executeInteractiveMapping = async (job, projectId) => {
  console.log(`[Job ${job.id}] 🧠 Starting AI Mapping & Discovery...`);
  logger.info(`[Job ${job.id}] 🧠 Starting AI Mapping & Discovery...`);

  try {
    const project = await Project.findById(projectId);

    // Safety check: Ensure we have the data from Phase 1
    const claimText = project.selectedClaim?.text;
    const description = project.patentData?.fullDescription;

    if (!claimText || !description)
      throw new Error("Missing claim or description data.");

    // 1. Generate Spec Mapping (Matches Image 2)
    await job.updateProgress(20);
    const mappingPrompt = promptTemplates.pcrPrompt(claimText, description);
    const mappingResponse = await aiService.generateResponse(mappingPrompt);
    const mappingParsed = safeJsonParse(mappingResponse);
    const pcrResult = mappingParsed.claimReading || [];

    // 2. Discover 50 Target Companies
    await job.updateProgress(60);
    console.log(`[Job ${job.id}] Finding 50 target companies...`);
    logger.info(`[Job ${job.id}] Finding 50 target companies...`);

    // Note: Ensure your promptTemplates.targetCompanyPrompt is updated to ask for 50 items
    const discoveryPrompt = promptTemplates.targetCompanyPrompt(
      claimText,
      pcrResult,
      project.patentData.biblioData,
    );

    const discoveryResponse = await aiService.generateResponse(discoveryPrompt);
    const discoveryParsed = safeJsonParse(discoveryResponse);

    // Flexible parsing for both naming conventions
    const rawList =
      discoveryParsed.candidates || discoveryParsed.targetCompanies || [];

    const companies = rawList.map((item) => ({
      company: item.company || item.name || "Unknown",
      product: item.product || "Flagship Offering",
      description: item.description || item.reasoning || "",
    }));

    console.log(`[Job ${job.id}] AI generated ${companies.length} companies.`);
    logger.info(`[Job ${job.id}] AI generated ${companies.length} companies.`);

    // 3. Update Database and Finalize Stage 2
    await Project.findByIdAndUpdate(projectId, {
      $set: {
        "results.pcrAnalysis": pcrResult,
        allDiscoveredProducts: companies, // This will now hold up to 50
        currentStep: "targetSelection", // 👈 Signals UI to show selection screen
        progress: 100,
      },
    });

    return { success: true, companyCount: companies.length };
  } catch (error) {
    console.error(`❌ [Job ${job.id}] Mapping Failed:`, error.message);
    logger.info(`❌ [Job ${job.id}] Mapping Failed:`, error.message);
    throw error;
  }
};
