// import axios from "axios";
// import { GEMINI_API_KEY } from "../config/services.js";

// class AIService {
//   constructor() {
//     this.apiKey = GEMINI_API_KEY;
//     this.apiUrl =
//       "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
//   }

//   async generateResponse(prompt, maxRetries = 5) {
//     let lastError;
//     const baseDelay = 2000;

//     for (let attempt = 1; attempt <= maxRetries; attempt++) {
//       try {
//         console.log(`AI request attempt ${attempt} of ${maxRetries}`);

//         const response = await axios.post(
//           `${this.apiUrl}?key=${this.apiKey}`,
//           {
//             contents: [
//               {
//                 parts: [
//                   {
//                     text: prompt,
//                   },
//                 ],
//               },
//             ],
//             generationConfig: {
//               temperature: 0.4,
//             },
//           },
//           {
//             headers: {
//               "Content-Type": "application/json",
//             },
//             timeout: 1200000,
//           },
//         );

//         if (
//           response.data &&
//           response.data.candidates &&
//           response.data.candidates[0] &&
//           response.data.candidates[0].content &&
//           response.data.candidates[0].content.parts &&
//           response.data.candidates[0].content.parts[0]
//         ) {
//           return response.data.candidates[0].content.parts[0].text;
//         } else {
//           throw new Error("Invalid response structure from Gemini API");
//         }
//       } catch (error) {
//         lastError = error;
//         console.log(
//           `AI request attempt ${attempt} failed:`,
//           error.response?.status || error.message,
//         );

//         if (attempt < maxRetries) {
//           const waitTime = Math.min(
//             baseDelay * Math.pow(2, attempt - 1),
//             20000,
//           );
//           console.log(`Waiting ${waitTime}ms before retry...`);
//           await new Promise((resolve) => setTimeout(resolve, waitTime));
//         }
//       }
//     }

//     throw new Error(
//       `AI request failed after ${maxRetries} attempts: ${lastError.message}`,
//     );
//   }
// }

// export default new AIService();

import axios from "axios";

import { GEMINI_API_KEY } from "../config/services.js";

class AIService {
  constructor() {
    this.apiKey = GEMINI_API_KEY;
    // 🟢 Use 1.5-pro for stable patent analysis
    this.apiUrl =
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro:generateContent";
  }

  async generateResponse(prompt, maxRetries = 3) {
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
        // 🟢 Safer logging to prevent Symbol crashes
        const errorMsg = error.response?.data?.error?.message || error.message;
        console.warn(`[Gemini] Attempt ${attempt} failed:`, String(errorMsg));

        await new Promise((r) => setTimeout(r, 2000 * attempt));
      }
    }

    throw new Error(`AI failed: ${String(lastError.message)}`);
  }
}

export default new AIService();
