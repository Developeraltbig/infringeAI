import { Queue } from "bullmq";
import { redisConnection } from "./redisConnection.config.js";

// Queue for heavy AI analysis tasks
export const analysisQueue = new Queue("InfringeAnalysisQueue", {
  connection: redisConnection,
  defaultJobOptions: {
    attempts: 3,
    backoff: { type: "exponential", delay: 5000 },
    removeOnComplete: true,
  },
});
