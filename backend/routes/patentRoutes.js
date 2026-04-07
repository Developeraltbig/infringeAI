import express from "express";
import * as patentController from "../controllers/patentController.js";
import verifyUserToken from "../middleware/verifyToken.middleware.js";

// 🛡️ CRITICAL: Ensure these are imported correctly from your middleware file
import {
  upload,
  validateFileContent,
} from "../middleware/upload.middleware.js";

const router = express.Router();

// Existing routes
router.post("/serp", patentController.fetchPatentData);

router.post("/quick-analyze", verifyUserToken, patentController.quickAnalyze);

// NEW: Add bulk analysis route
router.post(
  "/bulk-quick-analyze",
  verifyUserToken,
  patentController.bulkQuickAnalyze,
);

// 🟢 LINE 28 FIX:
router.post(
  "/bulk-upload",
  verifyUserToken,
  upload.single("file"), // Check if 'upload' exists
  validateFileContent, // Check if 'validateFileContent' exists
  patentController.bulkAnalyzeFromFile, // Check if this function exists in controller
);

export default router;
