// backend/utils/safeJsonParser.js
// Utility for safe JSON parsing with multiple fallback strategies

export function safeJsonParse(text, options = {}) {
  const {
    fallbackValue = null,
    logErrors = false,
    attemptRepair = true,
  } = options;

  if (!text || typeof text !== "string") {
    return fallbackValue;
  }

  // Strategy 1: Direct parse
  try {
    return JSON.parse(text);
  } catch (e1) {
    if (logErrors) console.log("Direct parse failed:", e1.message);
  }

  // Strategy 2: Extract from markdown code blocks
  const markdownPatterns = [
    /```json\s*([\s\S]*?)\s*```/,
    /```\s*([\s\S]*?)\s*```/,
    /`([^`]+)`/,
  ];

  for (const pattern of markdownPatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        if (logErrors)
          console.log(
            `Markdown extraction parse failed for pattern ${pattern}:`,
            e.message,
          );
      }
    }
  }

  // Strategy 3: Find JSON-like structure in text
  const jsonPatterns = [
    /(\{[\s\S]*\})/, // Find object
    /(\[[\s\S]*\])/, // Find array
  ];

  for (const pattern of jsonPatterns) {
    const match = text.match(pattern);
    if (match) {
      try {
        return JSON.parse(match[1]);
      } catch (e) {
        if (logErrors) console.log(`JSON structure parse failed:`, e.message);
      }
    }
  }

  // Strategy 4: Attempt to repair common issues
  if (attemptRepair) {
    let repairedText = text;

    // Remove common problematic patterns
    repairedText = repairedText
      .replace(/^[^{\[]*/, "") // Remove text before JSON
      .replace(/[^}\]]*$/, "") // Remove text after JSON
      .replace(/,\s*}/g, "}") // Remove trailing commas
      .replace(/,\s*\]/g, "]") // Remove trailing commas in arrays
      .replace(/'/g, '"') // Replace single quotes with double
      .replace(/(\w+):/g, '"$1":') // Quote unquoted keys
      .replace(/:\s*'([^']*)'/g, ': "$1"') // Fix single-quoted values
      .replace(/\n/g, " ") // Remove newlines that might break parsing
      .replace(/\t/g, " ") // Remove tabs
      .replace(/\s+/g, " ") // Normalize whitespace
      .trim();

    // Try to parse repaired text
    try {
      return JSON.parse(repairedText);
    } catch (e) {
      if (logErrors) console.log("Repair attempt failed:", e.message);
    }

    // Last resort: Try to extract specific patterns for known structures
    if (repairedText.includes('"targetCompanies"')) {
      // Special handling for target companies
      const companiesMatch = repairedText.match(
        /"targetCompanies"\s*:\s*\[([\s\S]*?)\]/,
      );
      if (companiesMatch) {
        try {
          const companiesArray = JSON.parse(`[${companiesMatch[1]}]`);
          return { targetCompanies: companiesArray };
        } catch (e) {
          if (logErrors)
            console.log("Target companies extraction failed:", e.message);
        }
      }
    }

    if (repairedText.includes('"claimReading"')) {
      // Special handling for PCR
      const claimMatch = repairedText.match(
        /"claimReading"\s*:\s*\[([\s\S]*?)\]/,
      );
      if (claimMatch) {
        try {
          const claimArray = JSON.parse(`[${claimMatch[1]}]`);
          return { claimReading: claimArray };
        } catch (e) {
          if (logErrors)
            console.log("Claim reading extraction failed:", e.message);
        }
      }
    }

    if (repairedText.includes('"webQueries"')) {
      // Special handling for web queries
      const queriesMatch = repairedText.match(
        /"webQueries"\s*:\s*\[([\s\S]*?)\]/,
      );
      if (queriesMatch) {
        try {
          const queriesArray = JSON.parse(`[${queriesMatch[1]}]`);
          return { webQueries: queriesArray };
        } catch (e) {
          if (logErrors)
            console.log("Web queries extraction failed:", e.message);
        }
      }
    }
  }

  // Return fallback value if all strategies fail
  return fallbackValue;
}
