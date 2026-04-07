import csv from "csv-parser";
import XLSX from "xlsx";
import { Readable } from "stream";

const sanitizePatentId = (id) => {
  if (!id) return null;
  let cleanId = String(id).trim();

  // 1. Remove common Excel formula triggers
  cleanId = cleanId.replace(/^[=+\-@]+/, "");

  // 2. Remove any HTML tags (XSS protection)
  cleanId = cleanId.replace(/<[^>]*>?/gm, "");

  // 3. 🟢 LOOSENED REGEX: Standard IDs can have dots, slashes, or hyphens
  // This allows US123, US-123, patent/US123/en, etc.
  const patentRegex = /^[a-zA-Z0-9/.\-_]+$/;

  return patentRegex.test(cleanId) ? cleanId : null;
};

export const parsePatentFile = async (fileBuffer, fileName) => {
  const patentIds = new Set();
  const fileExt = fileName.toLowerCase();

  if (fileExt.endsWith(".csv")) {
    return new Promise((resolve, reject) => {
      const stream = Readable.from(fileBuffer);
      stream
        .pipe(csv())
        .on("data", (row) => {
          // 🟢 SMART DETECTION: Check common keys, then try the first column if those fail
          const rawId =
            row.patentId ||
            row.patent_id ||
            row.id ||
            row.ID ||
            row["Patent ID"] ||
            row["PatentId"] ||
            Object.values(row)[0]; // Fallback to first column value

          const safeId = sanitizePatentId(rawId);
          if (safeId) patentIds.add(safeId);
        })
        .on("end", () => {
          console.log(
            `[Parser] Extracted ${patentIds.size} unique IDs from CSV`,
          );
          resolve(Array.from(patentIds));
        })
        .on("error", reject);
    });
  } else {
    // Excel Parsing
    const workbook = XLSX.read(fileBuffer, { type: "buffer" });
    const data = XLSX.utils.sheet_to_json(
      workbook.Sheets[workbook.SheetNames[0]],
    );

    data.forEach((row) => {
      // 🟢 SMART DETECTION for Excel
      const rawId =
        row.patentId ||
        row.patent_id ||
        row.id ||
        row.ID ||
        row["Patent ID"] ||
        row["PatentId"] ||
        Object.values(row)[0];

      const safeId = sanitizePatentId(rawId);
      if (safeId) patentIds.add(safeId);
    });
    return Array.from(patentIds);
  }
};
