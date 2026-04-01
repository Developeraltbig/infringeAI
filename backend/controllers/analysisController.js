// import aiService from "../services/aiService.js";
import { promptTemplates } from "../utils/promptTemplates.js";
import { safeJsonParse } from "../utils/safeJsonParser.js";

export const generatePCR = async (req, res) => {
  try {
    const { firstClaim, fullDescription } = req.body;

    if (!firstClaim || !fullDescription) {
      return res.status(400).json({
        error: "First claim and full description are required",
      });
    }

    const prompt = promptTemplates.pcrPrompt(firstClaim, fullDescription);
    const response = await aiService.generateResponse(prompt);

    // Use safe JSON parser
    const parsedData = safeJsonParse(response, {
      fallbackValue: { claimReading: [] },
      logErrors: true,
    });
    const pcrResult = parsedData.claimReading || [];

    res.json({
      success: true,
      pcrResult: pcrResult,
    });
  } catch (error) {
    console.error("PCR generation error:", error);
    res.status(500).json({ error: "Failed to generate PCR analysis" });
  }
};

export const generateTargetCompanies = async (req, res) => {
  try {
    const { firstClaim, pcrResult, biblioData } = req.body;

    if (!firstClaim || !pcrResult) {
      return res.status(400).json({
        error: "First claim and PCR result are required",
      });
    }

    const prompt = promptTemplates.targetCompanyPrompt(
      firstClaim,
      pcrResult,
      biblioData,
    );
    const response = await aiService.generateResponse(prompt);

    // Use safe JSON parser
    const parsedData = safeJsonParse(response, {
      fallbackValue: { targetCompanies: [] },
      logErrors: true,
    });

    // Take up to 50 companies from the result
    const companies = (parsedData.targetCompanies || []).slice(0, 50);

    res.json({
      success: true,
      companies: companies,
    });
  } catch (error) {
    console.error("Target companies generation error:", error);
    res.status(500).json({ error: "Failed to generate target companies" });
  }
};

export const generatePrelimAnalysis = async (req, res) => {
  try {
    const { firstClaim, pcrResult } = req.body;

    if (!firstClaim || !pcrResult) {
      return res.status(400).json({ error: "Missing required data" });
    }

    const prompt = promptTemplates.prelimAnalysisPrompt(firstClaim, pcrResult);
    const result = await aiService.generateResponse(prompt);

    res.json({
      success: true,
      prelimAnalysis: result,
    });
  } catch (error) {
    console.error("Prelim analysis generation error:", error);
    res.status(500).json({ error: "Failed to generate preliminary analysis" });
  }
};
