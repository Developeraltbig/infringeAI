import mongoose from "mongoose";

const projectSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  patentId: { type: String, required: true },
  mode: { 
    type: String, 
    enum: ["quick", "interactive", "bulk"], 
    default: "interactive" 
  },
  // NEW: Bulk tracking fields
  bulkGroupId: { type: String }, // Groups bulk projects together
  bulkGroupSize: { type: Number }, // Total patents in bulk group
  patentData: {
    firstClaim: String,
    fullDescription: String,
    pcrResult: mongoose.Schema.Types.Mixed,
    biblioData: mongoose.Schema.Types.Mixed,
  },
  selectedCompanies: [String], 
  quickModeProducts: [String], 
  allDiscoveredProducts: [{  
    product: String,
    company: String,
    avgScore: Number,
    reason: String,
    description: String,
    selected: Boolean,
    discoveryRank: Number
  }],
  status: {
    type: String,
    enum: ["created", "processing", "completed", "failed"],
    default: "created",
  },
  failureReason: { type: String }, 
  currentStep: {
    type: String,
    enum: [
      "initializing",
      "quickAnalysis",
      "productSelection", 
      "productProcessing",
      "finalizing",
      "completed"
    ],
    default: "initializing"
  },
  results: {
    pcrAnalysis: mongoose.Schema.Types.Mixed,
    targetCompanies: mongoose.Schema.Types.Mixed,
    prelimAnalysis: String,
    productAnalysis: {
      results: [{
        company: String,
        selectedProduct: String,
        reason: String,
        rank: Number,
        otherProducts: [{
          product: String,
          exaScore: Number,
          highlightSnippets: String,
          summary: String,
          hyperlink: String
        }]
      }]
    },
    quickAnalysisDetails: {
      candidatesAnalyzed: Number,
      highlightSearchesRun: Number,
      finalProductScores: [{
        product: String,
        company: String,
        avgScore: Number,
        reason: String
      }]
    },
    infringementStorylines: [{
      productName: String,
      storyline: String
    }],
    webQueries: [{
      productName: String,
      queries: [String]
    }],
    claimChartA: [{
      productName: String,
      chart: {
        analysis: String,
        score: String
      }
    }],
    exaResults: [{
      productName: String,
      searchResults: mongoose.Schema.Types.Mixed
    }],
    finalClaimChart: [{
      productName: String,
      claimChart: mongoose.Schema.Types.Mixed,
      infringementScore: String,
      urlMapping: mongoose.Schema.Types.Mixed
    }]
  },
  createdAt: { type: Date, default: Date.now },
  completedAt: Date,
}, {
  optimisticConcurrency: true
});

// Indexes
projectSchema.index({ userId: 1, createdAt: -1 });
projectSchema.index({ status: 1 });
projectSchema.index({ patentId: 1 });
projectSchema.index({ bulkGroupId: 1 });

// Method to get expected product count
projectSchema.methods.getExpectedProductCount = function() {
  if (this.mode === "quick" || this.mode === "bulk") {
    return this.quickModeProducts?.length || 5;
  } else if (this.mode === "interactive") {
    return this.selectedCompanies?.length || this.results?.productAnalysis?.results?.length || 0;
  } else {
    return this.results?.productAnalysis?.results?.length || 3;
  }
};

// Method to get products list
projectSchema.methods.getProductsList = function() {
  if (this.mode === "quick" || this.mode === "bulk") {
    return this.quickModeProducts || [];
  } else {
    return this.results?.productAnalysis?.results?.map(r => r.selectedProduct) || [];
  }
};

// NEW: Method to get products grouped by company (for interactive mode)
projectSchema.methods.getProductsGroupedByCompany = function() {
  if (this.mode === "interactive" && this.results?.productAnalysis?.results) {
    const grouped = {};
    for (const result of this.results.productAnalysis.results) {
      if (!grouped[result.company]) {
        grouped[result.company] = [];
      }
      grouped[result.company].push({
        product: result.selectedProduct,
        rank: result.rank,
        reason: result.reason
      });
    }
    return grouped;
  }
  return null;
};

export default mongoose.model("Project", projectSchema);