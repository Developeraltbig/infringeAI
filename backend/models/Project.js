import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patentId: { type: String, required: true },
  mode: {
    type: String,
    enum: ["quick", "interactive", "bulk"],
    default: "quick",
  },

  // Progress Tracking (Used by Frontend Progress Bar)
  status: {
    type: String,
    enum: ["created", "processing", "completed", "failed"],
    default: "created",
  },
  currentStep: { type: String, default: "initializing" },
  progress: { type: Number, default: 0 },

  // Bulk Tracking
  bulkGroupId: { type: String },

  // Data Storage
  patentData: {
    firstClaim: String,
    fullDescription: String,
    biblioData: mongoose.Schema.Types.Mixed,
  },

  // Mode specific data
  selectedCompanies: [String],
  quickModeProducts: [String], // Top 5 found by AI

  results: {
    pcrAnalysis: mongoose.Schema.Types.Mixed,
    infringementStorylines: Array,
    webQueries: Array,
    finalClaimChart: Array,
  },

  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
});

export default mongoose.model("Project", projectSchema);
