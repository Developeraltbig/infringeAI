import axios from "axios";
import { SERP_API_KEY } from "../config/services.js";
import {
  stripHtmlAndClean,
  extractFirstClaim,
  extractAssignees,
  extractInventors,
} from "../utils/patentParser.js";

class SerpService {
  constructor() {
    // Validate API key on initialization
    if (!SERP_API_KEY) {
      console.error("CRITICAL: SERP_API_KEY is not configured!");
    }
  }

  async fetchPatentDetails(patentId) {
    if (!SERP_API_KEY) {
      throw new Error(
        "SERP_API_KEY is not configured. Please add it to your .env file.",
      );
    }

    const url = "https://serpapi.com/search";
    const params = {
      engine: "google_patents_details",
      patent_id: patentId,
      api_key: SERP_API_KEY,
    };

    try {
      console.log("Fetching patent details for:", patentId);

      const response = await axios.get(url, { params, timeout: 120000 });
      const patentData = response.data;

      const biblioData = {
        title: patentData.title || "N/A",
        assignees: extractAssignees(patentData),
        filingDate: patentData.filing_date || "N/A",
        publicationDate: patentData.publication_date || "N/A",
        publicationNumber: patentData.publication_number || "N/A",
        inventors: extractInventors(patentData),
        abstract: patentData.abstract || "N/A",
        applicationNumber: patentData.application_number || "N/A",
        priorityDate: patentData.priority_date || "N/A",
        country: patentData.country || "N/A",
      };

      const allClaims = patentData.claims || [];
      const firstClaim = extractFirstClaim(allClaims);

      let fullDescription =
        patentData.description || "Description not available";
      if (patentData.description_link) {
        console.log("Fetching full description from link...");
        fullDescription = await this.fetchFullDescription(
          patentData.description_link,
        );
      }

      return {
        success: true,
        patentId,
        biblioData,
        claims: {
          all: allClaims,
          firstClaim: firstClaim,
          totalCount: allClaims.length,
          independentCount: allClaims.filter((claim) =>
            claim.match(/^1\.|^\d+\.\s*A\s+/),
          ).length,
        },
        fullDescription,
        descriptionLink: patentData.description_link || null,
        images: patentData.images || [],
        classifications: patentData.classifications || [],
        rawData: patentData,
      };
    } catch (error) {
      console.error("SERP API error:", error.message);

      if (error.response?.status === 401) {
        console.error(
          "401 Unauthorized: Your SERP API key is invalid or expired.",
        );
      }

      throw error;
    }
  }

  async fetchFullDescription(descriptionLink) {
    if (!descriptionLink) {
      return "Description not available";
    }

    try {
      const htmlResponse = await axios.get(descriptionLink, {
        timeout: 120000,
        responseType: "text",
        headers: {
          "User-Agent": "Mozilla/5.0 (compatible; PatentFetcher/1.0)",
        },
      });

      let cleanedText = stripHtmlAndClean(htmlResponse.data);

      const MAX_LENGTH = 250000;
      if (cleanedText.length > MAX_LENGTH) {
        cleanedText = cleanedText.substring(0, MAX_LENGTH) + "... [truncated]";
      }

      return cleanedText;
    } catch (error) {
      console.error("Error fetching description:", error.message);
      return "Error fetching full description";
    }
  }
}

export default new SerpService();
