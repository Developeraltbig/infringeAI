import express from "express";
import mongoose from "mongoose";
import Job from "../models/Job.js";
import Project from "../models/Project.js";
import ApiKeyUsage from "../models/ApiKeyUsage.js";

const router = express.Router();

router.get("/", async (req, res) => {
  try {
    const health = {
      status: "OK",
      timestamp: new Date().toISOString(),
      mongodb:
        mongoose.connection.readyState === 1 ? "connected" : "disconnected",
    };

    const [totalProjects, totalJobs, pendingJobs] = await Promise.all([
      Project.countDocuments(),
      Job.countDocuments(),
      Job.countDocuments({ status: "pending" }),
    ]);

    health.stats = { totalProjects, totalJobs, pendingJobs };

    res.json(health);
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get("/detailed", async (req, res) => {
  try {
    const jobStats = await Job.aggregate([
      {
        $group: {
          _id: { type: "$type", status: "$status" },
          count: { $sum: 1 },
        },
      },
    ]);

    const recentFailures = await Job.find({
      status: "failed",
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    })
      .select("type error createdAt")
      .limit(5)
      .sort({ createdAt: -1 });

    const completedJobs = await Job.aggregate([
      { $match: { status: "completed", completedAt: { $exists: true } } },
      {
        $project: {
          type: 1,
          processingTime: { $subtract: ["$completedAt", "$startedAt"] },
        },
      },
      {
        $group: {
          _id: "$type",
          avgTime: { $avg: "$processingTime" },
          minTime: { $min: "$processingTime" },
          maxTime: { $max: "$processingTime" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json({
      status: "OK",
      timestamp: new Date().toISOString(),
      jobStats,
      recentFailures,
      processingTimeStats: completedJobs.map((stat) => ({
        type: stat._id,
        avgTimeSeconds: Math.round(stat.avgTime / 1000),
        minTimeSeconds: Math.round(stat.minTime / 1000),
        maxTimeSeconds: Math.round(stat.maxTime / 1000),
        totalCompleted: stat.count,
      })),
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      error: error.message,
      timestamp: new Date().toISOString(),
    });
  }
});

router.get("/exa-keys/status", async (req, res) => {
  try {
    const usages = await ApiKeyUsage.find().lean();

    const keyStats = usages.map((u) => ({
      key: u.keyIdentifier,
      totalCalls: u.callCount || 0,
      highlightCalls: u.highlightCallCount || 0,
      contentCalls: u.contentCallCount || 0,
      estimatedCost: (u.estimatedCost || 0).toFixed(3),
      remainingBudget: (10 - (u.estimatedCost || 0)).toFixed(3),
      percentageUsed: ((u.estimatedCost || 0) / 10) * 100,
      lastUsed: u.lastUsed,
      lastError: u.lastError,
      lastErrorTime: u.lastErrorTime,
      rateLimitedUntil: u.rateLimitedUntil,
      isRateLimited: u.rateLimitedUntil
        ? u.rateLimitedUntil > new Date()
        : false,
    }));

    keyStats.sort((a, b) => a.totalCalls - b.totalCalls);

    const totals = {
      totalCalls: keyStats.reduce((sum, s) => sum + s.totalCalls, 0),
      totalHighlightCalls: keyStats.reduce(
        (sum, s) => sum + s.highlightCalls,
        0,
      ),
      totalContentCalls: keyStats.reduce((sum, s) => sum + s.contentCalls, 0),
      totalSpent: keyStats
        .reduce((sum, s) => sum + parseFloat(s.estimatedCost), 0)
        .toFixed(3),
      totalBudget: 50.0,
      remainingBudget: (
        50 - keyStats.reduce((sum, s) => sum + parseFloat(s.estimatedCost), 0)
      ).toFixed(3),
      percentageUsed: (
        (keyStats.reduce((sum, s) => sum + parseFloat(s.estimatedCost), 0) /
          50) *
        100
      ).toFixed(1),
    };

    const callCounts = keyStats.map((k) => k.totalCalls);
    const distribution = {
      standardDeviation: calculateStandardDeviation(callCounts),
      maxDifference:
        callCounts.length > 0
          ? Math.max(...callCounts) - Math.min(...callCounts)
          : 0,
      isBalanced:
        callCounts.length > 0
          ? Math.max(...callCounts) - Math.min(...callCounts) <= 10
          : true,
    };

    res.json({
      timestamp: new Date().toISOString(),
      totals,
      distribution,
      keyStatuses: keyStats,
      warnings: generateWarnings(keyStats, totals),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch API key statistics",
      message: error.message,
    });
  }
});

router.post("/exa-keys/reset", async (req, res) => {
  try {
    const resetToken = req.headers["x-reset-token"];
    if (resetToken !== "your-secret-reset-token") {
      return res.status(401).json({
        error: "Unauthorized",
        message: "Provide X-Reset-Token header with correct value",
      });
    }

    await ApiKeyUsage.updateMany(
      {},
      {
        $set: {
          callCount: 0,
          highlightCallCount: 0,
          contentCallCount: 0,
          estimatedCost: 0,
          lastError: null,
          lastErrorTime: null,
          rateLimitedUntil: null,
        },
      },
    );

    res.json({
      success: true,
      message: "All Exa API key usage statistics have been reset",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to reset statistics",
      message: error.message,
    });
  }
});

router.get("/exa-keys/distribution", async (req, res) => {
  try {
    const usages = await ApiKeyUsage.find().lean();

    const chartData = {
      labels: usages.map((u) => u.keyIdentifier),
      datasets: [
        { label: "Total Calls", data: usages.map((u) => u.callCount || 0) },
        {
          label: "Highlight Searches",
          data: usages.map((u) => u.highlightCallCount || 0),
        },
        {
          label: "Content Fetches",
          data: usages.map((u) => u.contentCallCount || 0),
        },
      ],
    };

    res.json({
      timestamp: new Date().toISOString(),
      chartData,
      summary: {
        mostUsed: usages.reduce(
          (max, u) => ((u.callCount || 0) > (max.callCount || 0) ? u : max),
          usages[0],
        )?.keyIdentifier,
        leastUsed: usages.reduce(
          (min, u) => ((u.callCount || 0) < (min.callCount || 0) ? u : min),
          usages[0],
        )?.keyIdentifier,
      },
    });
  } catch (error) {
    res.status(500).json({
      error: "Failed to fetch distribution data",
      message: error.message,
    });
  }
});

// Helper functions
function calculateStandardDeviation(values) {
  if (values.length === 0) return "0.00";
  const mean = values.reduce((sum, val) => sum + val, 0) / values.length;
  const squaredDifferences = values.map((val) => Math.pow(val - mean, 2));
  const variance =
    squaredDifferences.reduce((sum, val) => sum + val, 0) / values.length;
  return Math.sqrt(variance).toFixed(2);
}

function generateWarnings(keyStats, totals) {
  const warnings = [];

  keyStats.forEach((k) => {
    if (parseFloat(k.remainingBudget) < 1) {
      warnings.push(
        `${k.key} is nearly exhausted ($${k.remainingBudget} remaining)`,
      );
    }
  });

  const rateLimited = keyStats.filter((k) => k.isRateLimited);
  if (rateLimited.length > 0) {
    warnings.push(`${rateLimited.length} key(s) currently rate limited`);
  }

  if (parseFloat(totals.remainingBudget) < 10) {
    warnings.push(
      `Overall budget running low: $${totals.remainingBudget} of $50 remaining`,
    );
  }

  if (keyStats.length > 0) {
    const callCounts = keyStats.map((k) => k.totalCalls);
    const maxDiff = Math.max(...callCounts) - Math.min(...callCounts);
    if (maxDiff > 20) {
      warnings.push(
        `Uneven distribution detected: ${maxDiff} call difference between most and least used keys`,
      );
    }
  }

  const recentErrors = keyStats.filter(
    (k) => k.lastErrorTime && new Date() - new Date(k.lastErrorTime) < 3600000,
  );
  if (recentErrors.length > 0) {
    warnings.push(`${recentErrors.length} key(s) had errors in the last hour`);
  }

  return warnings;
}

export default router;
