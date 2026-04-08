import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import exaService from "../services/exaService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";

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
  console.log(`[Job ${job.id}] 🚀 Deep Analysis started for: ${productName}`);

  // 1. Fetch project and validate
  const project = await Project.findById(projectId);
  if (!project) throw new Error("Project not found");

  //  IDEMPOTENCY CHECK: If this product name is already in the results, stop here.
  // This prevents the "6/5 products" error if a job retries.
  const isAlreadyDone = project.results?.finalClaimChart?.some(
    (chart) => chart.productName === productName,
  );

  if (isAlreadyDone) {
    console.log(
      `[Job ${job.id}] Product ${productName} already exists. Skipping analysis.`,
    );
    return { success: true, skipped: true };
  }

  const patentData = project.patentData;

  try {
    // ==========================================
    // STEP 1: Infringement Storyline
    // ==========================================
    console.log(
      `[Job ${job.id}] Step 1: Generating Storyline for ${productName}...`,
    );
    const storylinePrompt = promptTemplates.infringementStorylinePrompt(
      productName,
      patentData,
    );
    const storylineResponse = await aiService.generateResponse(storylinePrompt);

    // Update DB with Storyline (Using $push for parallel safety)
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        "results.infringementStorylines": {
          productName,
          storyline: storylineResponse,
        },
      },
    });
    await job.updateProgress(20);

    // ==========================================
    // STEP 2: Generate Web Search Queries
    // ==========================================
    console.log(
      `[Job ${job.id}] Step 2: Generating search queries for ${productName}...`,
    );
    const queriesPrompt = promptTemplates.webQueriesPrompt(
      productName,
      storylineResponse,
      patentData,
    );
    const queriesResponse = await aiService.generateResponse(queriesPrompt);

    const parsedQueries = safeJsonParse(queriesResponse, {
      fallbackValue: { webQueries: [`${productName} technical documentation`] },
    });
    const queries = parsedQueries.webQueries;

    await Project.findByIdAndUpdate(projectId, {
      $push: { "results.webQueries": { productName, queries } },
    });
    await job.updateProgress(40);

    // ==========================================
    // STEP 3: Exa Search & Content Retrieval
    // ==========================================
    console.log(`[Job ${job.id}] Step 3: Searching web for evidence...`);
    let allSearchResults = [];

    // Search the top 2 most relevant queries
    for (const query of queries.slice(0, 2)) {
      const searchQuery = `${companyName || ""} ${productName} ${query}`.trim();

      const results = await exaService.searchWithHighlights(searchQuery);
      allSearchResults.push(...results);
    }

    const uniqueResults = exaService.deduplicateResults(allSearchResults);

    // AI Link Filter: Pick top 5 most relevant URLs
    const filterPrompt = promptTemplates.linkRelevanceFilterPrompt(
      productName,
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

    // Get full text content for the top URLs
    const webContent = await exaService.getFullContent(topUrls);

    await Project.findByIdAndUpdate(projectId, {
      $push: {
        "results.exaResults": { productName, searchResults: webContent },
      },
    });
    await job.updateProgress(70);

    // ==========================================
    // STEP 4: Final Claim Chart Generation
    // ==========================================
    console.log(
      `[Job ${job.id}] Step 4: Building final claim chart for ${productName}...`,
    );

    const contextText = webContent
      .map((c) => `Source URL: ${c.url}\nTitle: ${c.title}\nContent: ${c.text}`)
      .join("\n---\n");

    const finalChartPrompt = promptTemplates.finalClaimChartPrompt(
      patentData.firstClaim,
      storylineResponse,
      contextText,
      topUrls,
    );

    const manualUrlMapping = {};
    topUrls.forEach((url, index) => {
      manualUrlMapping[index + 1] = url; // Creates { "1": "http...", "2": "http..." }
    });

    const finalResponse = await aiService.generateResponse(finalChartPrompt);
    const finalData = safeJsonParse(finalResponse, {
      fallbackValue: { claimChart: [], infringementScore: "Medium" },
    });

    const finalResultItem = {
      productName,
      claimChart: finalData.claimChart,
      infringementScore: finalData.infringementScore,
      urlMapping: manualUrlMapping,
    };

    // Push the final result to the array
    await Project.findByIdAndUpdate(projectId, {
      $push: { "results.finalClaimChart": finalResultItem },
    });

    // ==========================================
    // STEP 5: Mode-Aware Completion Logic
    // ==========================================
    const updatedProject = await Project.findById(projectId);

    // 🟢 IDEMPOTENCY: Count UNIQUE product names only
    const uniqueFinishedProducts = new Set(
      updatedProject.results?.finalClaimChart?.map((c) => c.productName),
    );
    const actualCount = uniqueFinishedProducts.size;

    // Determine expected count based on mode
    let expectedCount =
      updatedProject.mode === "interactive"
        ? updatedProject.selectedCompanies?.length || 0
        : updatedProject.quickModeProducts?.length || 5;

    console.log(
      `[Job ${job.id}] Unique Progress: ${actualCount}/${expectedCount}`,
    );

    if (actualCount >= expectedCount && expectedCount > 0) {
      // 🟢 ATOMIC UPDATE: Only mark completed if not already completed
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
      await Project.findByIdAndUpdate(projectId, { progress: totalProgress });
    }

    await job.updateProgress(100);
    return { success: true, productName };
  } catch (error) {
    console.error(`[Job ${job.id}] ❌ Product Analysis Failed:`, error.message);
    throw error; // BullMQ handles the retry
  }
};
