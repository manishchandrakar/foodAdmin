import { Request, Response } from "express";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import multer from "multer";
import { ALLOWED_TYPES, MAX_FILE_SIZE } from "../utils/constants";

// ─── Multer Configuration ─────────────────────────────────────────────────────
const uploadDir = path.join(__dirname, "..", "public", "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Use inline callbacks so TypeScript infers multer's own types (avoids
// cross-package @types/express version conflicts)
export const upload = multer({
  storage: multer.diskStorage({
    destination: (_req, _file, cb) => cb(null, uploadDir),
    filename: (_req, file, cb) => {
      const ext = path.extname(file.originalname) || ".jpg";
      cb(null, `${crypto.randomUUID()}${ext}`);
    },
  }),
  fileFilter: (_req, file, cb) => {
    if (ALLOWED_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("Invalid file type. Allowed: jpg, png, webp"));
    }
  },
  limits: { fileSize: MAX_FILE_SIZE },
});

// POST /api/upload
export const handleUpload = (req: Request, res: Response): void => {
  if (!req.file) {
    res.status(400).json({ error: "No file provided" });
    return;
  }
  res.status(201).json({ url: `/uploads/${req.file.filename}` });
};
