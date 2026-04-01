import Project from "../models/Project.js";
import Job from "../models/Job.js";

// ---------------------------------------------------------------------------
// Create a new project
// ---------------------------------------------------------------------------
export const createProject = async (req, res) => {
  try {
    const {
      email,
      userId,
      patentId,
      patentData,
      mode,
      targetCompanies,
      selectedCompanies,
      prelimAnalysis,
    } = req.body;

    if (mode === "interactive") {
      if (!selectedCompanies || !Array.isArray(selectedCompanies) || selectedCompanies.length === 0 || selectedCompanies.length > 3) {
        return res.status(400).json({
          success: false,
          error: "Selected companies must be 1-3 items for interactive mode"
        });
      }
      for (const company of selectedCompanies) {
        if (typeof company !== 'string' || company.trim() === '') {
          return res.status(400).json({
            success: false,
            error: "Invalid company name provided"
          });
        }
      }
    }

    const project = new Project({
      email,
      userId,
      patentId,
      patentData,
      mode,
      targetCompanies,
      selectedCompanies,
      status: "processing",
      currentStep: "initializing",
      results: { prelimAnalysis: prelimAnalysis || "" },
    });
    await project.save();

    if (mode === "quick") {
      project.currentStep = "quickAnalysis";
      await project.save();
    } else {
      const productSelectionJob = new Job({
        projectId: project._id,
        type: "productSelection",
        status: "pending",
        input: { patentData, selectedCompanies },
      });
      await productSelectionJob.save();
      console.log(`Created product selection job: ${productSelectionJob._id} for project: ${project._id}`);
    }

    res.status(201).json({ success: true, projectId: project._id, message: "Project created successfully" });
  } catch (error) {
    console.error("Error creating project:", error);
    res.status(500).json({ success: false, error: error.message || "Failed to create project" });
  }
};

// ---------------------------------------------------------------------------
// Get project status
// ---------------------------------------------------------------------------
export const getProjectStatus = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findById(projectId).select("status currentStep mode quickModeProducts results selectedCompanies patentData");

    if (!project) return res.status(404).json({ error: "Project not found" });

    // Determine progress and current step
    let progress = 0;
    let currentStepName = "";
    const allJobs = await Job.find({ projectId });
    const jobOfType = type => allJobs.find(j => j.type === type);
    const jobsOfType = type => allJobs.filter(j => j.type === type);

    const SUBSTEP_WEIGHT = { infringementStoryline: 0.2, claimChartA: 0.4, webQueries: 0.6, exaSearch: 0.8, productFinalChart: 0.95 };
    const QUICK_PRODUCT_WEIGHT = 65 / 5;
    const INTERACTIVE_BASE = 15;
    const INTERACTIVE_PS_WEIGHT = 15;

    const addSubStepProgress = (job, perProductWeight, progress) => {
      if (job.status === "completed") return progress + perProductWeight;
      if (job.status === "processing") return progress + perProductWeight * (SUBSTEP_WEIGHT[job.currentSubStep] || 0.1);
      return progress + perProductWeight * 0.05;
    };

    if (project.status === "completed") return res.json({ status: "completed", currentStep: "completed", mode: project.mode, progressPercentage: 100, currentStepName: "Analysis complete!" });
    if (project.status === "failed") return res.json({ status: "failed", currentStep: project.currentStep, mode: project.mode, progressPercentage: 0, currentStepName: "Analysis failed" });

    if (project.mode === "quick" || project.mode === "bulk") {
      const qaJob = jobOfType("quickAnalysis");
      progress = qaJob ? (qaJob.status === "completed" ? 30 : 10) : 5;
      currentStepName = qaJob ? "Running quick analysis" : "Queued for analysis";

      const productJobs = jobsOfType("productAnalysis");
      productJobs.forEach(j => {
        progress = addSubStepProgress(j, QUICK_PRODUCT_WEIGHT, progress);
        if (j.currentSubStep) currentStepName = `${j.productName}: ${j.currentSubStep}`;
      });

      const pcJob = jobOfType("projectCompletion");
      if (pcJob?.status === "processing") { progress = Math.max(progress, 97); currentStepName = "Finalising report"; }
      if (pcJob?.status === "completed") { progress = 100; currentStepName = "Complete!"; }
      progress = Math.max(Math.round(progress), 5);
    } else if (project.mode === "interactive") {
      progress = INTERACTIVE_BASE;
      const psJob = jobOfType("productSelection");
      if (psJob?.status === "processing" || psJob?.status === "pending") { progress += 5; currentStepName = "Selecting products"; }
      if (psJob?.status === "completed") { progress += INTERACTIVE_PS_WEIGHT; currentStepName = "Products selected"; }

      const expected = project.getExpectedProductCount() || 3;
      const perProdWeight = 65 / expected;
      const productJobs = jobsOfType("productAnalysis");
      productJobs.forEach(j => { progress = addSubStepProgress(j, perProdWeight, progress); });
      const pcJob = jobOfType("projectCompletion");
      if (pcJob?.status === "processing") { progress = Math.max(progress, 97); currentStepName = "Finalising report"; }
      if (pcJob?.status === "completed") { progress = 100; currentStepName = "Complete!"; }
      progress = Math.max(Math.round(progress), INTERACTIVE_BASE);
    }

    progress = Math.min(progress, 99);
    res.json({
      status: project.status,
      currentStep: project.currentStep,
      mode: project.mode,
      progressPercentage: progress,
      currentStepName: currentStepName || "Processing…",
      jobStats: { total: allJobs.length, completed: allJobs.filter(j => j.status === "completed").length, processing: allJobs.filter(j => j.status === "processing").length, pending: allJobs.filter(j => j.status === "pending").length }
    });
  } catch (error) {
    console.error("Error fetching project status:", error);
    res.status(500).json({ error: "Failed to fetch project status" });
  }
};

// ---------------------------------------------------------------------------
// Get all projects (paginated)
// ---------------------------------------------------------------------------
export const getAllProjects = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const sortField = req.query.sortField || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const sortObj = { [sortField]: sortOrder };

    const userFilter = { userId: req.userId };
    const totalCount = await Project.countDocuments(userFilter);
    const projects = await Project.find(userFilter)
      .sort(sortObj)
      .skip(skip)
      .limit(limit)
      .select("email patentId patentData.biblioData status createdAt completedAt mode currentStep");

    res.json({
      success: true,
      projects,
      pagination: {
        currentPage: page,
        totalPages: Math.ceil(totalCount / limit),
        totalProjects: totalCount,
        projectsPerPage: limit,
        hasNextPage: page < Math.ceil(totalCount / limit),
        hasPrevPage: page > 1
      }
    });
  } catch (error) {
    console.error("Error fetching projects:", error);
    res.status(500).json({ success: false, error: "Failed to fetch projects" });
  }
};

// ---------------------------------------------------------------------------
// Get project details
// ---------------------------------------------------------------------------
export const getProjectDetails = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, error: "Project not found or access denied" });
    res.json({ success: true, project });
  } catch (error) {
    console.error("Error fetching project details:", error);
    res.status(500).json({ success: false, error: "Failed to fetch project details" });
  }
};

// ---------------------------------------------------------------------------
// Delete project
// ---------------------------------------------------------------------------
export const deleteProject = async (req, res) => {
  try {
    const { projectId } = req.params;
    const project = await Project.findOne({ _id: projectId, userId: req.userId });
    if (!project) return res.status(404).json({ success: false, error: "Project not found or access denied" });

    await Job.deleteMany({ projectId });
    await Project.findByIdAndDelete(projectId);

    res.json({ success: true, message: "Project deleted successfully" });
  } catch (error) {
    console.error("Error deleting project:", error);
    res.status(500).json({ success: false, error: "Failed to delete project" });
  }
};