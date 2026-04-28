import Project from "../models/Project.js";
import User from "../models/User.model.js";
import { analysisQueue } from "../config/queue.config.js";
import { v4 as uuidv4 } from "uuid";

// Helper to get User ID from nested auth structure
const getUserId = (req) =>
  req.user?.user?._id || req.user?._id || req.auth?.userId;

// Helper to normalize Patent IDs for SERP/Google
const normalizeId = (id) => {
  let nid = id.trim().toUpperCase();
  if (!nid.startsWith("patent/")) nid = `patent/${nid}`;
  if (!nid.endsWith("/en")) nid = `${nid}/en`;
  return nid;
};

// ---------------------------------------------------------------------------
// Shared credit check + deduction helper
// Returns { ok: true, user } or { ok: false, res already sent }
// ---------------------------------------------------------------------------
const deductCredit = async (userId, count = 1, res) => {
  const user = await User.findById(userId);
  if (!user) {
    res.status(401).json({ error: "User not found" });
    return { ok: false };
  }
  if (user.credits < count) {
    res.status(402).json({
      error: "INSUFFICIENT_CREDITS",
      message: "You have no credits left. Please contact the sales team.",
      credits: user.credits,
    });
    return { ok: false };
  }
  // Atomically deduct credits
  await User.findByIdAndUpdate(userId, { $inc: { credits: -count } });
  return { ok: true, user };
};

// ---------------------------------------------------------------------------
// Create Project — Quick / Interactive / Bulk
// ---------------------------------------------------------------------------
export const createProject = async (req, res) => {
  try {
    const { patentId, patentIds, mode, selectedCompanies } = req.body;
    const userId = getUserId(req);

    if (!userId) return res.status(401).json({ error: "User unauthorized" });

    // ==========================================
    // 1. BULK MODE
    // ==========================================
    if (mode === "bulk") {
      if (!Array.isArray(patentIds) || patentIds.length === 0) {
        return res
          .status(400)
          .json({ error: "patentIds array is required for bulk mode" });
      }

      const count = patentIds.length;

      // Check + deduct credits for all patents at once
      const creditResult = await deductCredit(userId, count, res);
      if (!creditResult.ok) return;

      const bulkGroupId = uuidv4();
      const createdProjects = [];
      const jobsToQueue = [];

      for (const id of patentIds) {
        const nId = normalizeId(id);
        const newProj = new Project({
          userId,
          patentId: nId,
          mode: "bulk",
          bulkGroupId,
          bulkGroupSize: count,
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

      await analysisQueue.addBulk(jobsToQueue);

      // Return updated credits so frontend can sync
      const updatedUser = await User.findById(userId).select("credits");

      return res.status(201).json({
        success: true,
        mode: "bulk",
        bulkGroupId,
        projectIds: createdProjects,
        message: `${count} projects queued for parallel analysis`,
        credits: updatedUser.credits,
      });
    }

    // ==========================================
    // 2. QUICK / INTERACTIVE (Single Patent)
    // ==========================================
    if (!patentId)
      return res.status(400).json({ error: "patentId is required" });

    // Check + deduct 1 credit
    const creditResult = await deductCredit(userId, 1, res);
    if (!creditResult.ok) return;

    const nId = normalizeId(patentId);

    const project = new Project({
      userId,
      patentId: nId,
      mode: mode || "quick",
      status: "processing",
      currentStep: "initializing",
      progress: 5,
    });

    await project.save();

    await analysisQueue.add("quick-analysis", {
      projectId: project._id,
      patentId: nId,
      type: "quick-analysis",
    });

    // Return updated credits so frontend can sync
    const updatedUser = await User.findById(userId).select("credits");

    res.status(201).json({
      success: true,
      projectId: project._id,
      message: "Project created successfully",
      credits: updatedUser.credits,
    });
  } catch (error) {
    console.error("Create Project Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

// ---------------------------------------------------------------------------
// Get Project Status
// ---------------------------------------------------------------------------
export const getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    const project = await Project.findOne({ _id: projectId, userId }).select(
      "status currentStep progress failureReason mode bulkGroupId patentId",
    );

    if (!project) {
      return res
        .status(404)
        .json({ error: "Project not found or access denied" });
    }

    const stepNames = {
      initializing: "Waking up AI workers...",
      quickAnalysis: "Analyzing Patent Claims...",
      productSelection: "Searching for Infringing Products...",
      productProcessing: "Generating Evidence Charts...",
      finalizing: "Finalizing Report...",
      completed: "Analysis Complete!",
    };

    // BULK MODE
    if (project.mode === "bulk" && project.bulkGroupId) {
      const allInGroup = await Project.find({
        bulkGroupId: project.bulkGroupId,
        userId,
      }).select("patentId status progress patentData.biblioData");

      const isBatchFinished = allInGroup.every(
        (p) => p.status === "completed" || p.status === "failed",
      );

      const totalProgress = allInGroup.reduce(
        (acc, p) => acc + (p.progress || 0),
        0,
      );
      const batchProgressPercentage = Math.round(
        totalProgress / allInGroup.length,
      );

      return res.json({
        status: isBatchFinished ? "completed" : "processing",
        currentStep: isBatchFinished ? "completed" : "batchProcessing",
        currentStepName: isBatchFinished
          ? "All Patents Analyzed!"
          : `Processing Batch (${allInGroup.filter((p) => p.status === "completed").length}/${allInGroup.length} done)`,
        progressPercentage: isBatchFinished ? 100 : batchProgressPercentage,
        mode: "bulk",
        patentId: project.patentId,
        groupProjects: allInGroup,
      });
    }

    // QUICK / INTERACTIVE
    res.json({
      status: project.status,
      currentStep: project.currentStep,
      currentStepName: stepNames[project.currentStep] || "Processing...",
      progressPercentage:
        project.status === "completed" ? 100 : project.progress || 10,
      mode: project.mode,
      patentId: project.patentId,
      error: project.failureReason,
    });
  } catch (error) {
    console.error("Status API Error:", error);
    res.status(500).json({ error: "Server error fetching status" });
  }
};

// ---------------------------------------------------------------------------
// Get All Projects (Dashboard/History)
// ---------------------------------------------------------------------------
export const getAllProjects = async (req, res) => {
  try {
    const userId = getUserId(req);
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 25;
    const skip = (page - 1) * limit;

    const query = { userId };
    const totalCount = await Project.countDocuments(query);

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
// Get Project Details
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
// Delete Project
// ---------------------------------------------------------------------------
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const userId = getUserId(req);

    const result = await Project.findOneAndDelete({ _id: projectId, userId });
    if (!result) return res.status(404).json({ error: "Project not found" });

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete project" });
  }
};

// ---------------------------------------------------------------------------
// Start Interactive Project
// ---------------------------------------------------------------------------
export const startInteractiveProject = async (req, res) => {
  try {
    let { patentId } = req.body;
    if (!patentId)
      return res.status(400).json({ error: "patentId is required" });

    let cleanId = patentId.trim().toUpperCase();
    if (!cleanId.startsWith("patent/")) cleanId = `patent/${cleanId}`;
    if (!cleanId.endsWith("/en")) cleanId = `${cleanId}/en`;

    const userId = getUserId(req);
    if (!userId) {
      return res
        .status(401)
        .json({ error: "Unauthorized: Missing User ID from token" });
    }

    // Check + deduct 1 credit
    const creditResult = await deductCredit(userId, 1, res);
    if (!creditResult.ok) return;

    const project = new Project({
      userId,
      patentId: cleanId,
      mode: "interactive",
      status: "processing",
      currentStep: "initializing",
      progress: 5,
    });
    await project.save();

    await analysisQueue.add("interactive-init", {
      projectId: project._id,
      patentId: cleanId,
      type: "interactive-init",
    });

    const updatedUser = await User.findById(userId).select("credits");

    res.status(202).json({
      success: true,
      projectId: project._id,
      credits: updatedUser.credits,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// ---------------------------------------------------------------------------
// Select Interactive Claim
// ---------------------------------------------------------------------------
export const selectInteractiveClaim = async (req, res) => {
  try {
    const { projectId, claimNumber } = req.body;
    const userId = getUserId(req);

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    const selected = project.allClaims.find((c) => c.number === claimNumber);
    if (!selected)
      return res.status(400).json({ error: "Invalid claim number" });

    await Project.findByIdAndUpdate(projectId, {
      $set: {
        selectedClaim: selected,
        currentStep: "generatingMapping",
        progress: 10,
      },
    });

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

// ---------------------------------------------------------------------------
// Finalize Interactive Targets
// ---------------------------------------------------------------------------
export const finalizeInteractiveTargets = async (req, res) => {
  try {
    const { projectId, selectedItems } = req.body;
    const userId = getUserId(req);

    const project = await Project.findOne({ _id: projectId, userId });
    if (!project) return res.status(404).json({ error: "Project not found" });

    await Project.findByIdAndUpdate(projectId, {
      $set: {
        selectedCompanies: selectedItems.map((i) => i.company),
        quickModeProducts: selectedItems.map((i) => i.product),
        status: "processing",
        currentStep: "productProcessing",
        progress: 5,
      },
    });

    for (const item of selectedItems) {
      await analysisQueue.add("product-analysis", {
        projectId: project._id,
        patentId: project.patentId,
        productName: item.product,
        companyName: item.company,
        type: "product-analysis",
      });
    }

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: "Failed to finalize" });
  }
};
