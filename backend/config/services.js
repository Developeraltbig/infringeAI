// backend/config/services.js
import ExaJs from "exa-js";
import env from "./env.config.js"; // your validated environment variables

// Initialize Exa class
const Exa = ExaJs.default || ExaJs;

export const {
  GEMINI_API_KEY,
  EXA_API_KEY_1,
  EXA_API_KEY_2,
  EXA_API_KEY_3,
  EXA_API_KEY_4,
  EXA_API_KEY_5,
  SERP_API_KEY,
  BRANDFETCH_CLIENT_ID,
} = env;

// Configure EXA API keys
const exaKeys = {
  key_1: EXA_API_KEY_1,
  key_2: EXA_API_KEY_2,
  key_3: EXA_API_KEY_3,
  key_4: EXA_API_KEY_4,
  key_5: EXA_API_KEY_5,
};

// Filter out undefined keys
const availableKeys = Object.entries(exaKeys)
  .filter(([_, key]) => key)
  .reduce((acc, [id, key]) => {
    acc[id] = key;
    return acc;
  }, {});

// Log EXA key status
const keyCount = Object.keys(availableKeys).length;
if (keyCount === 0) {
  console.error("CRITICAL: No EXA API keys configured!");
} else if (keyCount < 5) {
  console.warn(`WARNING: Only ${keyCount} of 5 EXA API keys configured`);
} else {
  console.log(`✓ All 5 EXA API keys configured successfully`);
}

// Export all services keys
export const brandfetch = {
  clientId: BRANDFETCH_CLIENT_ID,
};
export { availableKeys as exaKeys, Exa };
