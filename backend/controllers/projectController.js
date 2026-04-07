import Project from "../models/Project.js";
import { analysisQueue } from "../config/queue.config.js";
import { v4 as uuidv4 } from "uuid";

// Helper to get User ID from your specific nested auth structure
const getUserId = (req) =>
  req.user?.user?._id || req.user?._id || req.auth?.userId;

console.log("project controller ", getUserId);
// ---------------------------------------------------------------------------
// Create a new project (Triggered via API)
// ---------------------------------------------------------------------------

// export const createProject = async (req, res) => {
//   try {
//     const { patentId, mode } = req.body;
//     const userId = getUserId(req);

//     if (!userId) return res.status(401).json({ error: "User unauthorized" });

//     // 1. Normalize Patent ID for Google/SERP
//     let normalizedId = patentId.trim().toUpperCase();
//     if (!normalizedId.startsWith("patent/"))
//       normalizedId = `patent/${normalizedId}`;
//     if (!normalizedId.endsWith("/en")) normalizedId = `${normalizedId}/en`;

//     // 2. Create Project
//     const project = new Project({
//       userId,
//       patentId: normalizedId,
//       mode: mode || "quick",
//       status: "processing",
//       currentStep: "initializing",
//       progress: 5,
//     });
//     await project.save();

//     // 3. Add to Queue - ENSURE NAME MATCHES WORKER
//     await analysisQueue.add("quick-analysis", {
//       projectId: project._id,
//       patentId: normalizedId,
//       type: "quick-analysis",
//     });

//     res.status(201).json({ success: true, projectId: project._id });
//   } catch (error) {
//     res.status(500).json({ error: "Failed to create project" });
//   }
// };

// Helper to normalize Patent IDs for SERP/Google
const normalizeId = (id) => {
  let nid = id.trim().toUpperCase();
  if (!nid.startsWith("patent/")) nid = `patent/${nid}`;
  if (!nid.endsWith("/en")) nid = `${nid}/en`;
  return nid;
};

/**
 * Optimized Create Project API
 * Handles: Quick, Interactive, and Bulk Modes
 */
export const createProject = async (req, res) => {
  try {
    const { patentId, patentIds, mode, selectedCompanies } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ error: "User unauthorized" });

    // ==========================================
    // 1. BULK MODE LOGIC (Multiple Patents)
    // ==========================================
    if (mode === "bulk") {
      if (!Array.isArray(patentIds) || patentIds.length === 0) {
        return res
          .status(400)
          .json({ error: "patentIds array is required for bulk mode" });
      }

      const bulkGroupId = uuidv4();
      const bulkGroupSize = patentIds.length;
      const createdProjects = [];
      const jobsToQueue = [];

      // Create all projects first
      for (const id of patentIds) {
        const nId = normalizeId(id);
        const newProj = new Project({
          userId,
          patentId: nId,
          mode: "bulk",
          bulkGroupId,
          bulkGroupSize,
          status: "processing",
          progress: 5,
        });
        await newProj.save();
        createdProjects.push(newProj._id);

        jobsToQueue.push({
          name: "quick-analysis",
          data: {
            projectId: newProj._id,
            patentId: nId,
            type: "quick-analysis",
          },
        });
      }

      // 🚀 Optimization: Add all jobs to Redis in one single command
      await analysisQueue.addBulk(jobsToQueue);

      return res.status(201).json({
        success: true,
        mode: "bulk",
        bulkGroupId,
        projectIds: createdProjects,
        message: `${bulkGroupSize} projects queued for parallel analysis`,
      });
    }

    // ==========================================
    // 2. QUICK / INTERACTIVE LOGIC (Single Patent)
    // ==========================================
    if (!patentId)
      return res.status(400).json({ error: "patentId is required" });
    const nId = normalizeId(patentId);

    // Validation for Interactive Mode
    if (
      mode === "interactive" &&
      (!selectedCompanies || selectedCompanies.length === 0)
    ) {
      // Note: In interactive, we usually start with Discovery first, then select later.
    }

    const project = new Project({
      userId,
      patentId: nId,
      mode: mode || "quick",
      status: "processing",
      currentStep: "initializing",
      progress: 5,
    });

    await project.save();

    // Trigger Worker
    await analysisQueue.add("quick-analysis", {
      projectId: project._id,
      patentId: nId,
      type: "quick-analysis",
    });

    res.status(201).json({
      success: true,
      projectId: project._id,
      message: "Project created successfully",
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
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
// backend/controllers/projectController.js

/**
 * 1. Start Interactive Mode (Initial Step)
 */
export const startInteractiveProject = async (req, res) => {
  try {
    let { patentId } = req.body;
    if (!patentId)
      return res.status(400).json({ error: "patentId is required" });

    // 🟢 FORCE STABLE FORMAT: patent/US1234567/en
    let cleanId = patentId.trim().toUpperCase();
    if (!cleanId.startsWith("patent/")) cleanId = `patent/${cleanId}`;
    if (!cleanId.endsWith("/en")) cleanId = `${cleanId}/en`;

    const userId = req.user?.user?._id || req.user?._id;

    const project = new Project({
      userId,
      patentId: cleanId, // Save normalized ID
      mode: "interactive",
      status: "processing",
      currentStep: "initializing",
      progress: 5,
    });
    await project.save();

    await analysisQueue.add("interactive-init", {
      projectId: project._id,
      patentId: cleanId, // Pass normalized ID
      type: "interactive-init",
    });

    res.status(202).json({ success: true, projectId: project._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

/**
 * 2. Save User's Claim Choice (After Image 1)
 */

export const selectInteractiveClaim = async (req, res) => {
  try {
    const { projectId, claimNumber } = req.body;
    const userId = req.user?.user?._id || req.user?._id;

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    // 1. Find the specific claim the user selected
    const selected = project.allClaims.find((c) => c.number === claimNumber);
    if (!selected)
      return res.status(400).json({ error: "Invalid claim number" });

    // 2. Update status and save the selection
    await Project.findByIdAndUpdate(projectId, {
      $set: {
        selectedClaim: selected,
        currentStep: "generatingMapping", // Shows Stage 2 loader
        progress: 10,
      },
    });

    // 3. Trigger the AI Job
    await analysisQueue.add("interactive-mapping", {
      projectId: project._id,
      type: "interactive-mapping",
    });

    res.json({
      success: true,
      message: "AI Analysis started for the selected claim.",
    });
  } catch (error) {
    res.status(500).json({ error: "Failed to process claim selection" });
  }
};

// backend/controllers/projectController.js

export const finalizeInteractiveTargets = async (req, res) => {
  try {
    const { projectId, selectedItems } = req.body;
    // selectedItems should now look like: [{ company: "Google", product: "Vertex" }, { company: "AWS", product: "Kendra" }]

    const userId = req.user?.user?._id || req.user?._id;

    const project = await Project.findOne({ _id: projectId, userId });

    // We save the specific objects chosen
    await Project.findByIdAndUpdate(projectId, {
      $set: {
        // Map to just the product names for your existing logic,
        // but we will pass the company to the worker too
        selectedCompanies: selectedItems.map((i) => i.company),
        quickModeProducts: selectedItems.map((i) => i.product),
        status: "processing",
        currentStep: "productProcessing",
        progress: 5,
      },
    });

    // 🚀 PASS BOTH TO WORKER
    for (const item of selectedItems) {
      await analysisQueue.add("product-analysis", {
        projectId: project._id,
        patentId: project.patentId,
        productName: item.product,
        companyName: item.company, // 👈 New field
        type: "product-analysis",
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to finalize" });
  }
};
