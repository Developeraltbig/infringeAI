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
    const maxRetries = 5; // Give up after 5 attempts (~30 seconds)

    if (times > maxRetries) {
      logger.error(
        "Redis connection failed after maximum retries. Exiting process.",
      );
      process.exit(1); // Kill the server if Redis is completely dead
    }

    logger.warn(
      `Retrying Redis connection... (Attempt ${times}/${maxRetries})`,
    );

    return Math.min(times * 200, 2000); // Wait 200ms, 400ms, up to 2 seconds before next retry
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
