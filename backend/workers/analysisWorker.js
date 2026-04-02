// import { Worker } from "bullmq";
// import IORedis from "ioredis";
// import { executeQuickAnalysis } from "../jobs/quickAnalysis.job.js";
// import Project from "../models/Project.js";
// import logger from "../utils/winstonLogger.util.js";
// import env from "../config/env.config.js";

// // 1. Sahi variable assign karein
// const { REDIS_URL } = env;

// console.log("👷‍♂️ Analysis Worker initializing...");

// // 2. Worker ke liye dedicated connection banayein
// const workerConnection = new IORedis(REDIS_URL, {
//   maxRetriesPerRequest: null, // BullMQ worker ke liye compulsory hai
// });

// workerConnection.on("error", (err) => {
//   logger.error("Worker Redis Connection Error: %s", err.message);
// });

// // 3. Worker Define karein
// export const analysisWorker = new Worker(
//   "InfringeAnalysisQueue", // ⚠️ Ensure karein ye aapke queue.config.js se match kare
//   async (job) => {
//     const { projectId, patentId, type } = job.data;

//     logger.info(`[Job ${job.id}] Received task type: ${type}`);

//     switch (type) {
//       case "quick-analysis":
//         // Ye function aapke jobs/quickAnalysis.job.js se aayega
//         return await executeQuickAnalysis(job, projectId, patentId);

//       case "product-analysis":
//         // Future implementation ke liye:
//         logger.info(`Ready to analyze product: ${job.data.productName}`);
//         return { success: true };

//       default:
//         throw new Error(`Unknown job type: ${type}`);
//     }
//   },
//   {
//     connection: workerConnection,
//     concurrency: 5, // Ek saath 5 patents process honge
//   },
// );

// // 4. Success Event
// analysisWorker.on("completed", (job) => {
//   logger.info(`✅ Job ${job.id} (Type: ${job.data.type}) has completed!`);
// });

// // 5. Global Failure Handling
// analysisWorker.on("failed", async (job, err) => {
//   logger.error(`❌ Job ${job.id} failed: ${err.message}`);

//   if (job.data?.projectId) {
//     // Agar validation fail hui hai toh retry mat karo
//     if (err.message.includes("ValidationFailed")) {
//       await job.discard();
//     }

//     // Database mein failure record karein taaki Frontend ko pata chale
//     await Project.findByIdAndUpdate(job.data.projectId, {
//       status: "failed",
//       failureReason: err.message,
//       completedAt: new Date(),
//     });
//   }
// });

import { Worker } from "bullmq";
import IORedis from "ioredis";
import Project from "../models/Project.js";
import logger from "../utils/winstonLogger.util.js";
import env from "../config/env.config.js";

// Jobs Import karein
import { executeQuickAnalysis } from "../jobs/quickAnalysis.job.js";
import { executeProductAnalysis } from "../jobs/productAnalysis.job.js"; // 👈 Naya import

const { REDIS_URL } = env;

console.log("👷‍♂️ Analysis Worker initializing...");

const workerConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null,
});

workerConnection.on("error", (err) => {
  logger.error("Worker Redis Connection Error: %s", err.message);
});

export const analysisWorker = new Worker(
  "InfringeAnalysisQueue",
  async (job) => {
    console.log("!!! WORKER WOKE UP !!!"); // 👈 Add this

    const { projectId, patentId, type, productName } = job.data;

    console.log("Job Data Received:", job.data); // 👈 Add this

    logger.info(
      `[Job ${job.id}] 📥 Processing task: ${type} for Project: ${projectId}`,
    );

    switch (type) {
      case "quick-analysis":
        // Phase 1: Patent details nikalna aur top 5 products dhoondhna
        console.log("Entering Quick Analysis Logic..."); // 👈 Add this
        return await executeQuickAnalysis(job, projectId, patentId);

      case "product-analysis":
        // Phase 2: Har product ki deep AI research karna (Parallel chalega)
        if (!productName)
          throw new Error("Product name is missing for product-analysis job");
        return await executeProductAnalysis(
          job,
          projectId,
          patentId,
          productName,
        );

      default:
        throw new Error(`Unknown job type: ${type}`);
    }
  },
  {
    connection: workerConnection,
    concurrency: 5, // Ek saath 5 products ya analysis handle honge
  },
);

// --- EVENT LISTENERS ---

analysisWorker.on("completed", (job) => {
  logger.info(`✅ [Job ${job.id}] ${job.data.type} finished successfully.`);
});

analysisWorker.on("failed", async (job, err) => {
  logger.error(`❌ [Job ${job.id}] Failed: ${err.message}`);

  if (job.data?.projectId) {
    // Agar AI validation fail ho toh retry mat karo
    if (err.message.includes("ValidationFailed")) {
      await job.discard();
    }

    // DB mein status update karein taaki user ko "Failed" dikhe loader ki jagah
    await Project.findByIdAndUpdate(job.data.projectId, {
      status: "failed",
      failureReason: err.message,
      completedAt: new Date(),
    });
  }
});
