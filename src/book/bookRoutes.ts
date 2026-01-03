import express from "express";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";
import createBook from "./bookController.js";

// 👇 ESM replacement for __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const router = express.Router();

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.resolve(__dirname, "../../public/data/uploads"));
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// example route
router.post("/upload", upload.single("file"), createBook);

export default router;
