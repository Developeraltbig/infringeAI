import { Worker } from "bullmq";
import { redisConnection } from "../config/redisConnection.config.js";
import { executeQuickAnalysis } from "../jobs/quickAnalysis.job.js";
import Project from "../models/Project.js";
import logger from "../utils/winstonLogger.util.js";

console.log("👷‍♂️ Analysis Worker initialized.");

export const analysisWorker = new Worker(
  "PatentAnalysisQueue",
  async (job) => {
    const { projectId, patentId, type } = job.data;

    // Switch statement allows you to handle different job types in one queue!
    // Inside workers/analysisWorker.js
    switch (type) {
      case "quick-analysis":
        return await executeQuickAnalysis(job, projectId, patentId);

      case "product-analysis":
        // We will create this file next!
        // return await executeProductAnalysis(job, projectId, patentId, job.data.productName);
        logger.info(`Ready to analyze product: ${job.data.productName}`);
        return { success: true };

      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  },
  {
    connection: redisConnection,
    concurrency: 5, // Process 5 patents at the same time
  },
);

// Handle failures globally
analysisWorker.on("failed", async (job, err) => {
  console.log(`❌ Job ${job.id} failed: ${err.message}`);

  if (job.data?.projectId) {
    if (err.message.includes("ValidationFailed")) job.discard(); // Stop retrying

    await Project.findByIdAndUpdate(job.data.projectId, {
      status: "failed",
      failureReason: err.message,
    });
  }
});
