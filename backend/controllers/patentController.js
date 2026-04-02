import Project from "../models/Project.js";
import { analysisQueue } from "../config/queue.config.js";
import { v4 as uuidv4 } from "uuid";

/**
 * Utility to fetch data directly (Non-background)
 * Keeping this as is for your utility needs.
 */
export const fetchPatentData = async (req, res) => {
  try {
    const { patent_id } = req.body;
    if (!patent_id)
      return res.status(400).json({ error: "patent_id is required" });

    // Note: This remains a blocking call as it's a direct utility fetch
    const patentData = await serpService.fetchPatentDetails(patent_id);
    res.json(patentData);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};

/**
 * Single Patent Quick Analysis
 * Optimized with BullMQ (Instant Response)
 */
export const quickAnalyze = async (req, res) => {
  try {
    const { patent_id } = req.body;
    if (!patent_id)
      return res.status(400).json({ error: "patent_id is required" });

    // Securely get userId from your auth middleware
    const userId = req.user?.user?._id || req.user?._id;

    console.log("Extracted User ID:", userId);

    if (!userId) {
      return res
        .status(401)
        .json({ error: "User ID missing. Please log in again." });
    }

    // 1. Create the Project record in MongoDB
    const project = new Project({
      userId: userId,
      patentId: patent_id,
      mode: "quick",
      status: "processing",
      currentStep: "initializing",
      results: {},
    });
    await project.save();

    // 2. Add the job to the BullMQ Queue
    // This triggers the Worker to start SERP fetch and AI logic in the background
    await analysisQueue.add("quick-analysis", {
      projectId: project._id,
      patentId: patent_id,
      type: "quick-analysis",
    });

    // 3. Respond immediately
    res.status(202).json({
      success: true,
      projectId: project._id,
      message: "Quick analysis started in the background.",
    });
  } catch (error) {
    console.error("Quick analysis error:", error);
    res.status(500).json({ error: "Failed to start quick analysis" });
  }
};

/**
 * Bulk Patent Quick Analysis
 * Optimized with BullMQ Bulk (Handles many patents instantly)
 */
export const bulkQuickAnalyze = async (req, res) => {
  try {
    const { patent_ids } = req.body;

    c;

    if (!Array.isArray(patent_ids) || patent_ids.length === 0) {
      return res.status(400).json({ error: "patent_ids array is required" });
    }

    if (patent_ids.length > 10) {
      return res
        .status(400)
        .json({ error: "Maximum 10 patents allowed per bulk analysis" });
    }

    const userId = req.user?._id;
    const bulkGroupId = uuidv4();
    const jobsToQueue = [];
    const createdProjectIds = [];

    // We process the IDs but we DO NOT call SERP API here.
    // The Worker will handle the fetching/validation for each patent individually.
    for (const patentId of patent_ids) {
      let normalizedId = patentId.trim();
      if (!normalizedId.startsWith("patent/"))
        normalizedId = `patent/${normalizedId}`;
      if (!normalizedId.endsWith("/en") && !normalizedId.match(/\/[a-z]{2}$/))
        normalizedId += "/en";

      // 1. Create Project for each patent
      const project = new Project({
        userId: userId,
        patentId: normalizedId,
        mode: "bulk",
        bulkGroupId,
        bulkGroupSize: patent_ids.length,
        status: "processing",
        currentStep: "initializing",
        results: {},
      });
      await project.save();
      createdProjectIds.push(project._id);

      // 2. Prepare the job object for BullMQ
      jobsToQueue.push({
        name: "quick-analysis",
        data: {
          projectId: project._id,
          patentId: normalizedId,
          type: "quick-analysis",
        },
      });
    }

    // 3. Push all jobs to Redis in one single command (Very fast)
    await analysisQueue.addBulk(jobsToQueue);

    res.status(202).json({
      success: true,
      message: `Bulk analysis started for ${patent_ids.length} patents.`,
      bulkGroupId,
      projectIds: createdProjectIds,
    });
  } catch (error) {
    console.error("Bulk quick analysis error:", error);
    res.status(500).json({ error: "Failed to start bulk analysis" });
  }
};
