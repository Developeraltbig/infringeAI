import express from "express";
import authMiddleware from "../middleware/auth.js";
import {
  createProject,
  getProjectStatus,
  getAllProjects,
  getProjectDetails,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

// Add this new route
router.get("/logo-config", async (req, res) => {
  const { brandfetch } = await import("../config/services.js");

  if (!brandfetch.clientId) {
    return res.status(200).json({
      success: false,
      message: "Brandfetch not configured",
    });
  }

  res.json({
    success: true,
    clientId: brandfetch.clientId,
  });
});

// Routes - Ensure auth middleware is applied to all protected routes
router.post("/create", authMiddleware, createProject);
router.get("/:projectId/status", authMiddleware, getProjectStatus);
router.get("/", authMiddleware, getAllProjects);
router.get("/:projectId", authMiddleware, getProjectDetails);
router.delete("/:projectId", authMiddleware, deleteProject);

export default router;
