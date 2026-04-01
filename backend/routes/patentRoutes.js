import express from "express";
import * as patentController from "../controllers/patentController.js";
import verifyUserToken from "../middleware/verifyToken.middleware.js";

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

export default router;
