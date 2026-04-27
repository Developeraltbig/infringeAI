import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import exaService from "../services/exaService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";
import logger from "../utils/winstonLogger.util.js";

/**
 * Executes deep analysis for a single specific product.
 * Supports: Quick, Bulk, and Interactive modes.
 */

export const executeProductAnalysis = async (
  job,
  projectId,
  patentId,
  productName,
  companyName,
) => {
  // Safe fallbacks to prevent "undefined" strings in logs or DB
  const safeProduct = productName || "Unknown Product";
  const safeCompany = companyName || "Unknown Company";
  const logPrefix = `[Job ${job.id}][${safeCompany} - ${safeProduct}]`;

  console.log(`${logPrefix} 🚀 Deep Analysis started.`);
  logger.info(`${logPrefix} 🚀 Deep Analysis started.`);

  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  // 1. 🟢 IDEMPOTENCY CHECK
  // Use both names to distinguish between identical products from different companies
  const isAlreadyDone = project.results?.finalClaimChart?.some(
    (chart) =>
      chart.productName === safeProduct && chart.companyName === safeCompany,
  );

  if (isAlreadyDone) {
    console.log(`${logPrefix} Result already exists. Skipping.`);
    return { success: true, skipped: true };
  }

  const patentData = project.patentData;

  try {
    // ==========================================
    // STEP 1: Infringement Storyline
    // ==========================================
    console.log(`${logPrefix} Step 1: Generating Storyline...`);
    const storylinePrompt = promptTemplates.infringementStorylinePrompt(
      safeProduct,
      patentData,
    );
    const storylineResponse = await aiService.generateResponse(storylinePrompt);

    await Project.findByIdAndUpdate(projectId, {
      $push: {
        "results.infringementStorylines": {
          productName: safeProduct,
          storyline: storylineResponse,
        },
      },
    });
    await job.updateProgress(20);

    // ==========================================
    // STEP 2: Generate Web Search Queries
    // ==========================================
    console.log(`${logPrefix} Step 2: Generating search queries...`);
    const queriesPrompt = promptTemplates.webQueriesPrompt(
      safeProduct,
      storylineResponse,
      patentData,
    );
    const queriesResponse = await aiService.generateResponse(queriesPrompt);

    const parsedQueries = safeJsonParse(queriesResponse, {
      fallbackValue: {
        webQueries: [`${safeProduct} features and technical specifications`],
      },
    });
    const queries = parsedQueries.webQueries;

    await Project.findByIdAndUpdate(projectId, {
      $push: { "results.webQueries": { productName: safeProduct, queries } },
    });
    await job.updateProgress(40);

    // ==========================================
    // STEP 3: Exa Search & Content Retrieval
    // ==========================================
    console.log(`${logPrefix} Step 3: Searching web for evidence...`);
    let allSearchResults = [];

    for (const query of queries.slice(0, 2)) {
      // 🟢 FIX: Removed companyName/productName concatenation.
      // We trust the AI-generated query (which already contains the context) to prevent "undefined" queries.
      const searchQuery = query.trim();

      const results = await exaService.searchWithHighlights(searchQuery);
      allSearchResults.push(...results);
    }

    const uniqueResults = exaService.deduplicateResults(allSearchResults);
    const filterPrompt = promptTemplates.linkRelevanceFilterPrompt(
      safeProduct,
      patentData.firstClaim,
      JSON.stringify(uniqueResults),
    );
    const filterResponse = await aiService.generateResponse(filterPrompt);
    const filterResult = safeJsonParse(filterResponse, {
      fallbackValue: { selectedUrls: [] },
    });

    const topUrls = filterResult.selectedUrls
      .sort((a, b) => b.relevanceScore - a.relevanceScore)
      .slice(0, 5)
      .map((item) => item.url);

    const webContent = await exaService.getFullContent(topUrls);

    await Project.findByIdAndUpdate(projectId, {
      $push: {
        "results.exaResults": {
          productName: safeProduct,
          searchResults: webContent,
        },
      },
    });
    await job.updateProgress(70);

    // ==========================================
    // STEP 4: Final Claim Chart Generation
    // ==========================================
    console.log(`${logPrefix} Step 4: Building final claim chart...`);
    const contextText =
      webContent.length > 0
        ? webContent
            .map((c) => `Source URL: ${c.url}\nContent: ${c.text}`)
            .join("\n---\n")
        : "No specific web evidence found.";

    const finalChartPrompt = promptTemplates.finalClaimChartPrompt(
      patentData.firstClaim,
      storylineResponse,
      contextText,
      topUrls,
    );

    const manualUrlMapping = {};
    topUrls.forEach((url, index) => {
      manualUrlMapping[index + 1] = url;
    });

    const finalResponse = await aiService.generateResponse(finalChartPrompt);
    const finalData = safeJsonParse(finalResponse, {
      fallbackValue: { claimChart: [], infringementScore: "M" },
    });

    const finalResultItem = {
      productName: safeProduct,
      companyName: safeCompany,
      claimChart: finalData.claimChart,
      infringementScore: finalData.infringementScore,
      urlMapping: manualUrlMapping,
    };

    // 🟢 ATOMIC UPDATE: Pull existing and push new to prevent duplicates
    await Project.findByIdAndUpdate(projectId, {
      $pull: {
        "results.finalClaimChart": {
          productName: safeProduct,
          companyName: safeCompany,
        },
      },
    });
    await Project.findByIdAndUpdate(projectId, {
      $push: { "results.finalClaimChart": finalResultItem },
    });

    // ==========================================
    // STEP 5: Completion Logic
    // ==========================================
    const updatedProject = await Project.findById(projectId);
    const actualCount = updatedProject.results?.finalClaimChart?.length || 0;

    let expectedCount =
      updatedProject.mode === "interactive"
        ? updatedProject.selectedCompanies?.length || 0
        : updatedProject.quickModeProducts?.length || 5;

    console.log(
      `${logPrefix} Current Batch Progress: ${actualCount}/${expectedCount}`,
    );

    if (actualCount >= expectedCount && expectedCount > 0) {
      await Project.findOneAndUpdate(
        { _id: projectId, status: { $ne: "completed" } },
        {
          $set: {
            status: "completed",
            currentStep: "completed",
            progress: 100,
            completedAt: new Date(),
          },
        },
      );
    } else {
      const totalProgress = Math.floor(60 + (actualCount / expectedCount) * 40);
      await Project.findByIdAndUpdate(projectId, {
        progress: Math.min(totalProgress, 99),
      });
    }

    await job.updateProgress(100);
    return { success: true };
  } catch (error) {
    console.error(`${logPrefix} ❌ Error:`, error.message);
    logger.error(`${logPrefix} ❌ Error: ${error.message}`);
    throw error;
  }
};
