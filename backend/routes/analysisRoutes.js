// const express = require("express");
// const router = express.Router();
// const analysisController = require("../controllers/analysisController");
// const authMiddleware = require("../middleware/auth");

// router.post("/pcr", authMiddleware, analysisController.generatePCR);
// router.post("/target-companies", authMiddleware, analysisController.generateTargetCompanies);
// router.post("/prelim-analysis", authMiddleware, analysisController.generatePrelimAnalysis);

// module.exports = router;

import express from "express";
import analysisController from "../controllers/analysisController.js";
import authMiddleware from "../middleware/auth.js";

const router = express.Router();

router.post("/pcr", authMiddleware, analysisController.generatePCR);
router.post(
  "/target-companies",
  authMiddleware,
  analysisController.generateTargetCompanies,
);
router.post(
  "/prelim-analysis",
  authMiddleware,
  analysisController.generatePrelimAnalysis,
);

export default router; // <-- Use ESM export
