import Project from "../models/Project.js";
import { analysisQueue } from "../config/queue.config.js";

// Helper to get User ID from your specific nested auth structure
const getUserId = (req) =>
  req.user?.user?._id || req.user?._id || req.auth?.userId;

console.log("project controller ", getUserId);
// ---------------------------------------------------------------------------
// Create a new project (Triggered via API)
// ---------------------------------------------------------------------------
// export const createProject = async (req, res) => {
//   try {
//     const { patentId, mode, selectedCompanies } = req.body;
//     const userId = getUserId(req);

//     if (!userId) return res.status(401).json({ error: "User unauthorized" });

//     // 1. Validation for Interactive Mode
//     if (mode === "interactive") {
//       if (
//         !selectedCompanies ||
//         !Array.isArray(selectedCompanies) ||
//         selectedCompanies.length === 0 ||
//         selectedCompanies.length > 3
//       ) {
//         return res.status(400).json({
//           error: "Selected companies must be 1-3 items for interactive mode",
//         });
//       }
//     }

//     // 2. Create Project in MongoDB
//     const project = new Project({
//       userId,
//       patentId,
//       mode: mode || "quick",
//       selectedCompanies: selectedCompanies || [],
//       status: "processing",
//       currentStep: "initializing",
//       progress: 5, // Start with a small jump
//     });
//     await project.save();

//     // 3. Add to BullMQ Queue (Instead of creating a 'Job' document)
//     await analysisQueue.add("infringe-analysis", {
//       projectId: project._id,
//       patentId,
//       type: mode === "quick" ? "quick-analysis" : "interactive-analysis",
//     });

//     res.status(201).json({
//       success: true,
//       projectId: project._id,
//       message: "Project created and queued for analysis",
//     });
//   } catch (error) {
//     console.error("Error creating project:", error);
//     res.status(500).json({ success: false, error: "Failed to create project" });
//   }
// };

export const createProject = async (req, res) => {
  try {
    const { patentId, mode } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ error: "User unauthorized" });

    // 1. Normalize Patent ID for Google/SERP
    let normalizedId = patentId.trim().toUpperCase();
    if (!normalizedId.startsWith("patent/"))
      normalizedId = `patent/${normalizedId}`;
    if (!normalizedId.endsWith("/en")) normalizedId = `${normalizedId}/en`;

    // 2. Create Project
    const project = new Project({
      userId,
      patentId: normalizedId,
      mode: mode || "quick",
      status: "processing",
      currentStep: "initializing",
      progress: 5,
    });
    await project.save();

    // 3. Add to Queue - ENSURE NAME MATCHES WORKER
    await analysisQueue.add("quick-analysis", {
      projectId: project._id,
      patentId: normalizedId,
      type: "quick-analysis",
    });

    res.status(201).json({ success: true, projectId: project._id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create project" });
  }
};

// ---------------------------------------------------------------------------
// Get project status (Polled by Frontend Processing components)
// ---------------------------------------------------------------------------
export const getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    // SECURITY: Ensure user owns the project
    const project = await Project.findOne({ _id: projectId, userId }).select(
      "status currentStep progress failureReason mode",
    );

    if (!project)
      return res
        .status(404)
        .json({ error: "Project not found or access denied" });

    // UI-Friendly labels for internal steps
    const stepNames = {
      initializing: "Waking up AI workers...",
      quickAnalysis: "Analyzing Patent Claims...",
      productSelection: "Searching for Infringing Products...",
      productProcessing: "Generating Evidence Charts...",
      finalizing: "Finalizing Report...",
      completed: "Analysis Complete!",
    };

    res.json({
      status: project.status,
      currentStep: project.currentStep,
      currentStepName: stepNames[project.currentStep] || "Processing...",
      progressPercentage:
        project.status === "completed" ? 100 : project.progress || 10,
      mode: project.mode,
      error: project.failureReason,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error fetching status" });
  }
};

// ---------------------------------------------------------------------------
// Get all projects (For Dashboard History/Sidebar)
// ---------------------------------------------------------------------------
export const getAllProjects = async (req, res) => {
  try {
    const userId = getUserId(req);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const query = { userId };
    const totalCount = await Project.countDocuments(query);

    // Lean query for performance (only fetching what list needs)
    const projects = await Project.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .select("patentId status createdAt mode progress currentStep")
      .lean();

    res.json({
      success: true,
      projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProjects: totalCount,
      },
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch projects" });
  }
};

// ---------------------------------------------------------------------------
// Get project details (For the final ReportView)
// ---------------------------------------------------------------------------
export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    const project = await Project.findOne({ _id: projectId, userId });

    if (!project) return res.status(404).json({ error: "Project not found" });

    res.json({ success: true, project });
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch project details" });
  }
};

// ---------------------------------------------------------------------------
// Delete project
// ---------------------------------------------------------------------------
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    const result = await Project.findOneAndDelete({ _id: projectId, userId });

    if (!result) return res.status(404).json({ error: "Project not found" });

    // Note: In a real production app, you might also want to remove
    // active jobs from Redis if the project is still processing.

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// backend/controllers/projectController.js

export const resumeInteractive = async (req, res) => {
  try {
    const { projectId, selectedProducts } = req.body; // Array of product names
    const userId = req.user?.user?._id || req.user?._id;

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // 1. Update project state
    project.selectedCompanies = selectedProducts;
    project.status = "processing";
    project.currentStep = "productProcessing";
    project.progress = 5; // Reset progress for Phase 2
    await project.save();

    // 2. Spawn sub-jobs for ONLY the selected products
    for (const productName of selectedProducts) {
      await analysisQueue.add("product-analysis", {
        projectId: project._id,
        patentId: project.patentId,
        productName: productName,
        type: "product-analysis",
      });
    }

    res.json({
      success: true,
      message: "Deep analysis resumed for selected products",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to resume analysis" });
  }
};
