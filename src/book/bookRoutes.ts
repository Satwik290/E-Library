import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import authenticate from "../middlewares/authenticate.js";
import {
  createBook,
  updateBook,
  deleteBook,
  listBooks,
  getSingleBook,
} from "./bookController.js";

const router = express.Router();

/* ES MODULE dirname */
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/* Multer disk storage */
const upload = multer({
  dest: path.resolve(__dirname, "../../public/data/uploads"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post(
  "/",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  createBook
);

router.patch(
  "/:bookId",
  authenticate,
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "file", maxCount: 1 },
  ]),
  updateBook
);

router.get("/", listBooks);
router.get("/:bookId", getSingleBook);
router.delete("/:bookId", authenticate, deleteBook);

export default router;
