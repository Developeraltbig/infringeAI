import "./workers/index.js";
import env from "./config/env.config.js";

import app from "./app.js";
import mongoose from "mongoose";
import logger from "./utils/winstonLogger.util.js";
import { redisConnection } from "./config/redisConnection.config.js";

const { PORT, MONGODB_URI, NODE_ENV } = env;

// MongoDB Connection Logic
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI);
    logger.info("MongoDB Connected Successfully");
  } catch (error) {
    logger.error("MongoDB Connection Error: %s", error.message);
    process.exit(1);
  }
};

// Redis Connection Logic
const connectRedis = async () => {
  try {
    // Send a simple ping. If Redis isn't ready, this will wait.
    // If max retries are hit in the config, the app will exit safely.
    await redisConnection.ping();
  } catch (error) {
    logger.error("Failed to reach Redis during startup: %s", error.message);
    process.exit(1);
  }
};

Promise.all([connectDB(), connectRedis()])
  .then(() => {
    // This ONLY runs if both databases are 100% online and responding
    app.listen(PORT, "0.0.0.0", () => {
      logger.info(`Server is listening on port ${PORT} in ${NODE_ENV} mode`);
    });
  })
  .catch((error) => {
    logger.error("Server initialization failed: %s", error.message);
    process.exit(1);
  });
