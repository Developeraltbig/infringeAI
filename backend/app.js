// import "./workers/index.js";
// import os from "os";
// import cors from "cors";
// import express from "express";
// import mongoose from "mongoose";
// import cookieParser from "cookie-parser";
// import env from "./config/env.config.js";
// import createHttpError from "http-errors";
// import statusMonitor from "express-status-monitor";
// import errorHandler from "./middleware/error.middleware.js";
// import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
// import { consoleLogger, fileLogger } from "./utils/morganLogger.util.js";
// import * as patentController from "../controllers/patentController.js";

// // Import routes
// import patentRoutes from "./routes/patentRoutes.js";
// // import projectRoutes from "./routes/projectRoutes.js";
// // import analysisRoutes from "./routes/analysisRoutes.js";
// // import healthRoutes from "./routes/healthRoutes.js";

// const app = express();

// const { CORS_ORIGIN_URL, API_VERSION, NODE_ENV, PATSERO_BACKEND_URL } = env;

// const BASE_API_URL = `/api/${API_VERSION}`;
// const allowedOrigins = CORS_ORIGIN_URL?.split(",").map((o) => o.trim()) || [];

// // App will likely be hosted behind a Load Balancer (like AWS ALB or Nginx), all requests will look like they come from the Load Balancer's IP. This line tells Express to read the 'X-Forwarded-For' header to get the user's REAL IP address.
// app.set("trust proxy", 1);

// app.use(fileLogger); // File logs
// app.use(consoleLogger); // Console logs

// // Rate Limiter
// app.use(BASE_API_URL, apiLimiter);

// // Global Middleware
// app.use(cookieParser());
// app.use(statusMonitor());
// app.use(express.json({ limit: "20mb" }));
// app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// // CORS
// app.use(
//   cors({
//     origin: (origin, callback) => {
//       // Allow requests with no origin (mobile apps, postman)
//       if (!origin) {
//         return callback(null, true);
//       }

//       if (allowedOrigins.includes(origin)) {
//         return callback(null, true);
//       } else {
//         return callback(null, true);
//       }
//     },
//     credentials: true,
//   }),
// );

// // Health Check
// app.get(`${BASE_API_URL}/health`, (req, res) => {
//   const cpuCount = os.cpus().length;
//   const concurrency = Math.max(1, cpuCount - 1);

//   res.status(200).json({
//     status: mongoose.connection.readyState === 1 ? "ok" : "db_disconnected",
//     version: API_VERSION,
//     env: NODE_ENV,
//     cpuCount,
//     recommendedConcurrency: concurrency,
//     uptime: process.uptime(),
//   });
// });

// // API Routes
// // app.use(`${BASE_API_URL}/public`, publicRoutes);
// // app.use(`${BASE_API_URL}/user-auth`, userAuthRoutes);
// // app.use(`${BASE_API_URL}/admin-auth`, adminAuthRoutes);
// // app.use(`${BASE_API_URL}/admin/content`, adminContentRoutes);

// // app.use("/api/auth", authRoutes);
// app.use(`${PATSERO_BACKEND_URL}/patents`, patentRoutes);
// // app.use("/api/projects", projectRoutes);
// // app.use("/api/analysis", analysisRoutes);

// // API v1 404 Handler
// app.use(BASE_API_URL, (req, res, next) => {
//   next(createHttpError.NotFound());
// });

// console.log(`${PATSERO_BACKEND_URL}/patents`);

// // Global Error Handler
// app.use(errorHandler);

// export default app;

import "./workers/index.js"; // 🔥 Keep this at the top to start workers
import os from "os";
import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";
import env from "./config/env.config.js";
import createHttpError from "http-errors";
import statusMonitor from "express-status-monitor";
import errorHandler from "./middleware/error.middleware.js";
import { apiLimiter } from "./middleware/rateLimiter.middleware.js";
import { consoleLogger, fileLogger } from "./utils/morganLogger.util.js";

// Import routes
import patentRoutes from "./routes/patentRoutes.js";
// import projectRoutes from "./routes/projectRoutes.js";

const app = express();

// Destructure env variables
const { CORS_ORIGIN_URL, API_VERSION, NODE_ENV } = env;

// 1. ROUTE PREFIX LOGIC
// Use BASE_API_URL for local routing.
// If your sub-part is at "/api/v1", keep it simple.
const BASE_API_URL = `/api/${API_VERSION}`;
const allowedOrigins = CORS_ORIGIN_URL?.split(",").map((o) => o.trim()) || [];

app.set("trust proxy", 1);

// Logging
app.use(fileLogger);
app.use(consoleLogger);

// Rate Limiter applied to all API routes
app.use(BASE_API_URL, apiLimiter);

// Global Middleware
app.use(cookieParser());
app.use(statusMonitor());
app.use(express.json({ limit: "20mb" }));
app.use(express.urlencoded({ extended: true, limit: "20mb" }));

// 2. CORS REFINEMENT
app.use(
  cors({
    origin: (origin, callback) => {
      // Allow Postman or Mobile (no origin)
      if (!origin) return callback(null, true);

      // Check if origin is in our allowed list
      if (allowedOrigins.indexOf(origin) !== -1 || NODE_ENV === "development") {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  }),
);

// Health Check
app.get(`${BASE_API_URL}/health`, (req, res) => {
  res.status(200).json({
    status: mongoose.connection.readyState === 1 ? "ok" : "db_disconnected",
    cpuCount: os.cpus().length,
    uptime: process.uptime(),
  });
});

/**
 * 3. API ROUTES
 */
// Use a consistent prefix for all routes in this sub-part.
// Example: /api/v1/patents
app.use(`${BASE_API_URL}/patents`, patentRoutes);

// You MUST uncomment and use projectRoutes.
// This is how the frontend will poll for status!
// app.use(`${BASE_API_URL}/projects`, projectRoutes);

// API v1 404 Handler
app.use(BASE_API_URL, (req, res, next) => {
  next(createHttpError.NotFound());
});

// Global Error Handler (MUST BE LAST)
app.use(errorHandler);

export default app;
