// import mongoose from "mongoose";

// const projectSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
//   patentId: { type: String, required: true },
//   mode: {
//     type: String,
//     enum: ["quick", "interactive", "bulk"],
//     default: "quick",
//   },

//   // Progress Tracking (Used by Frontend Progress Bar)
//   status: {
//     type: String,
//     enum: ["created", "processing", "completed", "failed"],
//     default: "created",
//   },
//   currentStep: { type: String, default: "initializing" },
//   progress: { type: Number, default: 0 },

//   // Bulk Tracking
//   bulkGroupId: { type: String },

//   // Data Storage
//   patentData: {
//     firstClaim: String,
//     fullDescription: String,
//     biblioData: mongoose.Schema.Types.Mixed,
//   },

//   // Mode specific data
//   selectedCompanies: [String],
//   quickModeProducts: [String], // Top 5 found by AI

//   results: {
//     pcrAnalysis: mongoose.Schema.Types.Mixed,
//     infringementStorylines: Array,
//     webQueries: Array,
//     finalClaimChart: Array,
//   },

//   createdAt: { type: Date, default: Date.now },
//   completedAt: Date,
// });

// export default mongoose.models.Project ||
//   mongoose.model("Project", projectSchema);

import mongoose from "mongoose";

const projectSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    patentId: { type: String, required: true },
    mode: {
      type: String,
      enum: ["quick", "interactive", "bulk"],
      default: "quick",
    },

    // SHARED TRACKING
    status: {
      type: String,
      enum: ["created", "processing", "completed", "failed"],
      default: "created",
    },
    currentStep: { type: String, default: "initializing" },
    progress: { type: Number, default: 0 },
    failureReason: { type: String },

    //  NEW: INTERACTIVE MODE FIELDS (Optional)
    // Store all claims so user can pick one (Image 1)
    allClaims: [
      {
        number: Number,
        text: String,
        isIndependent: Boolean,
      },
    ],
    // Store the specific claim the user clicked "Proceed" on
    selectedClaim: {
      number: Number,
      text: String,
    },

    //  BULK TRACKING
    bulkGroupId: { type: String },
    bulkGroupSize: { type: Number },

    //  PATENT DATA
    patentData: {
      firstClaim: String, // Quick mode uses this directly
      fullDescription: String,
      biblioData: mongoose.Schema.Types.Mixed,
    },

    //  TARGETS
    selectedCompanies: [String], // User picks these in Interactive, or AI picks in Quick
    quickModeProducts: [String],
    allDiscoveredProducts: [
      {
        product: String,
        company: String,
        avgScore: Number,
        reason: String,
        description: String,
        selected: Boolean,
      },
    ],

    //  RESULTS STORAGE
    results: {
      pcrAnalysis: mongoose.Schema.Types.Mixed, // The "Claim Spec Mapping" (Image 2)
      infringementStorylines: [{ productName: String, storyline: String }],
      webQueries: [{ productName: String, queries: [String] }],
      finalClaimChart: [
        {
          productName: String,
          claimChart: mongoose.Schema.Types.Mixed,
          infringementScore: String,
          urlMapping: mongoose.Schema.Types.Mixed,
        },
      ],
    },
    createdAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true },
);

export default mongoose.model("Project", projectSchema);
