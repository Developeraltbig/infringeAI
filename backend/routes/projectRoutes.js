// import express from "express";
// import authMiddleware from "../middleware/auth.js";
// import {
//   createProject,
//   getProjectStatus,
//   getAllProjects,
//   getProjectDetails,
//   deleteProject,
// } from "../controllers/projectController.js";

// const router = express.Router();

// // Add this new route
// router.get("/logo-config", async (req, res) => {
//   const { brandfetch } = await import("../config/services.js");

//   if (!brandfetch.clientId) {
//     return res.status(200).json({
//       success: false,
//       message: "Brandfetch not configured",
//     });
//   }

//   res.json({
//     success: true,
//     clientId: brandfetch.clientId,
//   });
// });

// // Routes - Ensure auth middleware is applied to all protected routes
// router.post("/create", authMiddleware, createProject);
// router.get("/:projectId/status", authMiddleware, getProjectStatus);
// router.get("/", authMiddleware, getAllProjects);
// router.get("/:projectId", authMiddleware, getProjectDetails);
// router.delete("/:projectId", authMiddleware, deleteProject);

// export default router;

import express from "express";
// 🟢 Use the middleware that verifies via Central Software
import verifyUserToken from "../middleware/verifyToken.middleware.js";
import {
  createProject,
  getProjectStatus,
  getAllProjects,
  getProjectDetails,
  deleteProject,
} from "../controllers/projectController.js";

const router = express.Router();

/**
 * @route   GET /api/v1/projects/logo-config
 * @desc    Fetch Brandfetch configuration
 * @access  Protected
 */
router.get("/logo-config", verifyUserToken, async (req, res) => {
  try {
    const { brandfetch } = await import("../config/services.js");

    if (!brandfetch?.clientId) {
      return res.status(200).json({
        success: false,
        message: "Brandfetch not configured",
      });
    }

    res.json({
      success: true,
      clientId: brandfetch.clientId,
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to load logo config" });
  }
});

/**
 * @route   POST /api/v1/projects/create
 * @desc    Start a new project (Triggered by SearchArea)
 */
router.post("/create", verifyUserToken, createProject);

/**
 * @route   GET /api/v1/projects/all
 * @desc    Fetch project history (Used by Sidebar/ProjectList)
 */
router.get("/all", verifyUserToken, getAllProjects);

/**
 * @route   GET /api/v1/projects/status/:projectId
 * @desc    Poll for analysis progress (Used by ProcessingModal)
 */
router.get("/status/:projectId", verifyUserToken, getProjectStatus);

/**
 * @route   GET /api/v1/projects/details/:projectId
 * @desc    Get full analysis results (Used by ReportView)
 */
router.get("/details/:projectId", verifyUserToken, getProjectDetails);

/**
 * @route   DELETE /api/v1/projects/:projectId
 * @desc    Remove project and results
 */
router.delete("/:projectId", verifyUserToken, deleteProject);

export default router;
