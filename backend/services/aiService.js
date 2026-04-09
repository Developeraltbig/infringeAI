import axios from "axios";

import { GEMINI_API_KEY } from "../config/services.js";
import logger from "../utils/winstonLogger.util.js";

class AIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    // 🟢 Use 1.5-pro for stable patent analysis
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
  }

  // async generateResponse(prompt, maxRetries = 3) {
  //   let lastError;

  //   for (let attempt = 1; attempt <= maxRetries; attempt++) {
  //     try {
  //       console.log(`[Gemini] Requesting attempt ${attempt}...`);

  //       const response = await axios.post(
  //         `${this.apiUrl}?key=${this.apiKey}`,
  //         {
  //           contents: [{ parts: [{ text: String(prompt) }] }], // 🟢 Explicit String conversion
  //           generationConfig: { temperature: 0.2 },
  //         },
  //         { headers: { "Content-Type": "application/json" }, timeout: 180000 },
  //       );

  //       const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  //       if (!text) throw new Error("Empty response from AI");

  //       return text;
  //     } catch (error) {
  //       lastError = error;
  //       // 🟢 Safer logging to prevent Symbol crashes
  //       const errorMsg = error.response?.data?.error?.message || error.message;
  //       console.warn(`[Gemini] Attempt ${attempt} failed:`, String(errorMsg));

  //       await new Promise((r) => setTimeout(r, 2000 * attempt));
  //     }
  //   }

  //   throw new Error(`AI failed: ${String(lastError.message)}`);
  // }

  async generateResponse(prompt, maxRetries = 5) {
    let lastError;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        console.log(`[Gemini] Requesting attempt ${attempt}...`);

        const response = await axios.post(
          `${this.apiUrl}?key=${this.apiKey}`,
          {
            contents: [{ parts: [{ text: String(prompt) }] }], // 🟢 Explicit String conversion
            generationConfig: { temperature: 0.2 },
          },
          { headers: { "Content-Type": "application/json" }, timeout: 180000 },
        );

        const text = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!text) throw new Error("Empty response from AI");

        return text;
      } catch (error) {
        lastError = error;
        const status = error.response?.status;

        const errorMsg = error.response?.data?.error?.message || error.message;
        console.warn(`[Gemini] Attempt ${attempt} failed:`, String(errorMsg));
        logger.info(`[Gemini] Attempt ${attempt} failed:`, String(errorMsg));

        // 🔴 If 503 (Overloaded) or 429 (Rate Limit), wait MUCH longer
        if (status === 503 || status === 429 || error.code === "ECONNRESET") {
          const waitTime = attempt * 10000; // 10s, 20s, 30s...
          console.warn(
            `[Gemini] System overloaded. Sleeping for ${waitTime / 1000}s...`,
          );
          logger.info(
            `[Gemini] System overloaded. Sleeping for ${waitTime / 1000}s...`,
          );
          await new Promise((r) => setTimeout(r, waitTime));
          continue;
        }

        await new Promise((r) => setTimeout(r, 2000));
      }
    }
    throw new Error(`AI failed: ${lastError.message}`);
  }
}

export default new AIService();

// backend/services/aiService.js
