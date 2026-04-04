import Project from "../models/Project.js";
import aiService from "../services/aiService.js";
import exaService from "../services/exaService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";

/**
 * Executes deep analysis for a single specific product.
 * This runs in parallel for each product in the top 5 list.
 */
export const executeProductAnalysis = async (
  job,
  projectId,
  patentId,
  productName,
) => {
  console.log(`[Job ${job.id}] 🚀 Deep Analysis started for: ${productName}`);

  // 1. Fetch project and validate
  const project = await Project.findById(projectId);

  if (!project) throw new Error("Project not found");

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
      const results = await exaService.searchWithHighlights(
        `${productName} ${query}`,
      );
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
    console.log(`[Job ${job.id}] Step 4: Building final claim chart...`);

    const contextText = webContent
      .map((c) => `Source URL: ${c.url}\nTitle: ${c.title}\nContent: ${c.text}`)
      .join("\n---\n");

    const finalChartPrompt = promptTemplates.finalClaimChartPrompt(
      patentData.firstClaim,
      storylineResponse,
      contextText,
      topUrls,
    );

    const finalResponse = await aiService.generateResponse(finalChartPrompt);
    const finalData = safeJsonParse(finalResponse, {
      fallbackValue: { claimChart: [], infringementScore: "Medium" },
    });

    const finalResultItem = {
      productName,
      claimChart: finalData.claimChart,
      infringementScore: finalData.infringementScore,
      urlMapping: finalData.urlMapping || {},
    };

    // Push the final result to the array
    await Project.findByIdAndUpdate(projectId, {
      $push: { "results.finalClaimChart": finalResultItem },
    });

    // ==========================================
    // STEP 5: Check for Project Completion
    // ==========================================
    // const updatedProject = await Project.findById(projectId);
    // const expected = updatedProject.quickModeProducts.length || 5;
    // const actual = updatedProject.results.finalClaimChart.length;

    const updatedProject = await Project.findById(projectId);
    const expected = updatedProject.getExpectedProductCount(); // 💡 Uses your schema method
    const actual = updatedProject.results.finalClaimChart.length;

    console.log(
      `[Job ${job.id}] Progress: ${actual}/${expected} products complete.`,
    );

    if (actual >= expected) {
      await Project.findByIdAndUpdate(projectId, {
        status: "completed",
        currentStep: "completed",
        progress: 100,
        completedAt: new Date(),
      });
      console.log(`🏁🏁 Project ${projectId} is officially COMPLETE!`);
    } else {
      // Update overall project percentage based on how many products are done
      const totalProgress = Math.floor(60 + (actual / expected) * 40);
      await Project.findByIdAndUpdate(projectId, { progress: totalProgress });
    }

    await job.updateProgress(100);
    return { success: true, productName };
  } catch (error) {
    console.error(`[Job ${job.id}] ❌ Product Analysis Failed:`, error.message);
    throw error; // Let BullMQ retry
  }
};
