import multer from "multer";
import { fileTypeFromBuffer } from "file-type";

const storage = multer.memoryStorage();

// 🟢 Named Export: upload
export const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
});

// 🟢 Named Export: validateFileContent
export const validateFileContent = async (req, res, next) => {
  if (!req.file) return next();
  try {
    const type = await fileTypeFromBuffer(req.file.buffer);
    const allowedMimes = [
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      "application/vnd.ms-excel",
      "text/plain",
      "text/csv",
    ];
    if (type && !allowedMimes.includes(type.mime)) {
      return res.status(400).json({ error: "Invalid file content." });
    }
    next();
  } catch (error) {
    next(error);
  }
};
