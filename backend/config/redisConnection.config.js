import IORedis from "ioredis";
import env from "./env.config.js";
import logger from "../utils/winstonLogger.util.js";

const { REDIS_URL } = env;

// This connection is now used for BullMQ, Blacklisting, AND Caching!
export const redisConnection = new IORedis(REDIS_URL, {
  maxRetriesPerRequest: null, // Required by BullMQ
  enableReadyCheck: false,

  // Stability options
  retryStrategy: (times) => {
    // 5 ki jagah 20 se 50 retries rakhein
    const maxRetries = 50;

    if (times > maxRetries) {
      logger.error(
        "Redis connection failed after 50 attempts. Check if Redis server is running.",
      );
      return null; // process.exit(1) ki jagah null return karein taaki app crash na ho
    }

    // Har retry ke beech mein gap badhayein (1s, 2s, 3s...)
    const delay = Math.min(times * 1000, 5000);
    logger.warn(
      `Retrying Redis connection... (Attempt ${times}/${maxRetries}) in ${delay}ms`,
    );
    return delay;
  },

  reconnectOnError: (err) => {
    const targetError = "READONLY";
    if (err.message.includes(targetError)) {
      return true;
    }
    return false;
  },
});

// Attach Event Listeners for real-time logging
redisConnection.on("connect", () => {
  logger.info("Redis Connected Successfully");
});

redisConnection.on("error", (err) => {
  // Only log actual errors, not standard connection drops (which are handled by retryStrategy)
  if (err.code !== "ECONNREFUSED") {
    logger.error("Redis Error: %s", err.message);
  }
});
