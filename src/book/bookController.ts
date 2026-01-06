import  type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import fs from "fs";
import path from "path";

import Book from "./bookModel.js";
import {
  uploadToCloudinary,
  deleteFromCloudinary,
} from "../utils/cloudinaryHelpers.js";

/* CREATE */
export const createBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { title, author, description, price } = req.body;

    if (!title || !author) return next(createHttpError(400, "Title & author required"));

    const files = req.files as any;
    if (!files?.coverImage || !files?.file)
      return next(createHttpError(400, "Cover image & file required"));

    const cover = files.coverImage[0];
    const bookFile = files.file[0];

    const coverPath = path.join(cover.destination, cover.filename);
    const filePath = path.join(bookFile.destination, bookFile.filename);

    const coverUpload = await uploadToCloudinary(coverPath, "books/covers", "image");
    const fileUpload = await uploadToCloudinary(filePath, "books/files", "raw");

    fs.unlinkSync(coverPath);
    fs.unlinkSync(filePath);

    const book = await Book.create({
      title,
      author,
      description,
      price,
      coverImage: { url: coverUpload.secure_url, publicId: coverUpload.public_id },
      file: { url: fileUpload.secure_url, publicId: fileUpload.public_id },
      createdBy: req.userId!,
    });

    res.status(201).json({ success: true, data: book });
  } catch (e) {
    next(e);
  }
};

/* UPDATE */
export const updateBook = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const book = await Book.findById(req.params.bookId);
    if (!book) return next(createHttpError(404, "Book not found"));

    const files = req.files as any;

    if (files?.coverImage?.[0]) {
      const f = files.coverImage[0];
      const p = path.join(f.destination, f.filename);
      await deleteFromCloudinary(book.coverImage.publicId, "image");
      const u = await uploadToCloudinary(p, "books/covers", "image");
      fs.unlinkSync(p);
      book.coverImage = { url: u.secure_url, publicId: u.public_id };
    }

    if (files?.file?.[0]) {
      const f = files.file[0];
      const p = path.join(f.destination, f.filename);
      await deleteFromCloudinary(book.file.publicId, "raw");
      const u = await uploadToCloudinary(p, "books/files", "raw");
      fs.unlinkSync(p);
      book.file = { url: u.secure_url, publicId: u.public_id };
    }

    book.title = req.body.title ?? book.title;
    book.author = req.body.author ?? book.author;
    book.description = req.body.description ?? book.description;
    book.price = req.body.price ?? book.price;

    await book.save();
    res.json({ success: true, data: book });
  } catch (e) {
    next(e);
  }
};

/* GET */
export const listBooks = async (_: Request, res: Response) => {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json({ success: true, data: books });
};

export const getSingleBook = async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return next(createHttpError(404, "Book not found"));
  res.json({ success: true, data: book });
};

/* DELETE */
export const deleteBook = async (req: Request, res: Response, next: NextFunction) => {
  const book = await Book.findById(req.params.bookId);
  if (!book) return next(createHttpError(404, "Book not found"));

  await deleteFromCloudinary(book.coverImage.publicId, "image");
  await deleteFromCloudinary(book.file.publicId, "raw");
  await book.deleteOne();

  res.json({ success: true, message: "Book deleted successfully" });
};
