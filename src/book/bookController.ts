import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import fs from "fs";

import Book from "./bookModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryHelpers.js";

/* =========================================================
   CREATE BOOK
========================================================= */
export const createBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { title, author, description, price } = req.body;

    if (!title || !author) {
      return next(createHttpError(400, "Title and author are required"));
    }

    const files = req.files as
      | {
          coverImage?: Express.Multer.File[];
          file?: Express.Multer.File[];
        }
      | undefined;

    if (!files?.coverImage || !files?.file) {
      return next(
        createHttpError(400, "Cover image and book file are required")
      );
    }

    const coverImageFile = files.coverImage[0];
    const bookFile = files.file[0];

    /* ---------- Upload to Cloudinary ---------- */
    const coverImageUpload = await uploadToCloudinary(
      coverImageFile.path,
      "books/covers",
      "image"
    );

    const bookFileUpload = await uploadToCloudinary(
      bookFile.path,
      "books/files",
      "raw"
    );

    /* ---------- Remove local files ---------- */
    fs.unlinkSync(coverImageFile.path);
    fs.unlinkSync(bookFile.path);

    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImage: {
        url: coverImageUpload.secure_url,
        publicId: coverImageUpload.public_id,
      },
      file: {
        url: bookFileUpload.secure_url,
        publicId: bookFileUpload.public_id,
      },
      createdBy: req.userId,
    });

    res.status(201).json({
      success: true,
      message: "Book created successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   UPDATE BOOK
========================================================= */
export const updateBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    const files = req.files as
      | {
          coverImage?: Express.Multer.File[];
          file?: Express.Multer.File[];
        }
      | undefined;

    /* ---------- Update Cover Image ---------- */
    if (files?.coverImage?.[0]) {
      await deleteFromCloudinary(book.coverImage.publicId, "image");

      const upload = await uploadToCloudinary(
        files.coverImage[0].path,
        "books/covers",
        "image"
      );

      fs.unlinkSync(files.coverImage[0].path);

      book.coverImage = {
        url: upload.secure_url,
        publicId: upload.public_id,
      };
    }

    /* ---------- Update Book File ---------- */
    if (files?.file?.[0]) {
      await deleteFromCloudinary(book.file.publicId, "raw");

      const upload = await uploadToCloudinary(
        files.file[0].path,
        "books/files",
        "raw"
      );

      fs.unlinkSync(files.file[0].path);

      book.file = {
        url: upload.secure_url,
        publicId: upload.public_id,
      };
    }

    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.description = req.body.description ?? book.description;
    book.price = req.body.price ?? book.price;

    await book.save();

    res.json({
      success: true,
      message: "Book updated successfully",
      data: book,
    });
  } catch (error) {
    next(error);
  }
};

/* =========================================================
   DELETE BOOK
========================================================= */
export const deleteBook = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { bookId } = req.params;
    const book = await Book.findById(bookId);

    if (!book) {
      return next(createHttpError(404, "Book not found"));
    }

    /* ---------- Cloudinary Cleanup ---------- */
    await deleteFromCloudinary(book.coverImage.publicId, "image");
    await deleteFromCloudinary(book.file.publicId, "raw");

    await book.deleteOne();

    res.json({
      success: true,
      message: "Book deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};
