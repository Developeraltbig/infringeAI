import { Exa, exaKeys } from "../config/services.js";

class ExaService {
  constructor() {
    this.clients = [];
    this.initializeClients();
  }

  initializeClients() {
    // Collect all valid API keys from config and create clients
    for (const apiKey of Object.values(exaKeys)) {
      if (apiKey) {
        this.clients.push(new Exa(apiKey));
      }
    }

    if (this.clients.length === 0) {
      console.error("CRITICAL: No EXA API keys configured in .env!");
    }
  }

  // Simple helper to pick a random Exa client (acts as a basic load balancer)
  getRandomClient() {
    const randomIndex = Math.floor(Math.random() * this.clients.length);
    return this.clients[randomIndex];
  }

  async searchWithHighlights(query, maxRetries = 3) {
    const baseDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const client = this.getRandomClient();
        console.log(
          `[ExaService] Highlight search attempt ${attempt} for: "${query}"`,
        );

        const result = await client.searchAndContents(query, {
          numResults: 25,
          highlights: {
            numSentences: 3,
            highlightsPerUrl: 2,
            query: query,
          },
        });

        return result.results || [];
      } catch (error) {
        console.warn(
          `[ExaService] Search attempt ${attempt} failed: ${error.message}`,
        );

        if (attempt < maxRetries) {
          const waitTime = Math.min(
            baseDelay * Math.pow(2, attempt - 1),
            10000,
          );
          console.log(`[ExaService] Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          // Let BullMQ catch this and retry the entire background job
          throw new Error(
            `Exa search failed after ${maxRetries} attempts: ${error.message}`,
          );
        }
      }
    }
    return [];
  }

  async getFullContent(urls, maxRetries = 3) {
    if (!urls || urls.length === 0) return [];

    const baseDelay = 2000;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const client = this.getRandomClient();
        console.log(
          `[ExaService] Content fetch attempt ${attempt} for ${urls.length} URLs`,
        );

        const result = await client.getContents(urls, {
          text: {
            maxCharacters: 10000,
          },
        });

        return result.results || [];
      } catch (error) {
        console.warn(
          `[ExaService] Content fetch attempt ${attempt} failed: ${error.message}`,
        );

        if (attempt < maxRetries) {
          const waitTime = Math.min(
            baseDelay * Math.pow(2, attempt - 1),
            10000,
          );
          console.log(`[ExaService] Waiting ${waitTime}ms before retry...`);
          await new Promise((resolve) => setTimeout(resolve, waitTime));
        } else {
          // Let BullMQ catch this and retry the entire background job
          throw new Error(
            `Exa content fetch failed after ${maxRetries} attempts: ${error.message}`,
          );
        }
      }
    }
    return [];
  }

  deduplicateResults(results) {
    const seen = new Set();
    const unique = [];

    for (const result of results) {
      if (!seen.has(result.url)) {
        seen.add(result.url);
        unique.push(result);
      }
    }

    return unique;
  }
}

export default new ExaService();
