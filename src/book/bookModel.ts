import mongoose, { Schema, Document } from "mongoose";
import type { BookType } from "./bookTypes.js";

export interface BookDocument extends BookType, Document {}

const bookSchema = new Schema<BookDocument>(
  {
    title: { type: String, required: true },
    author: { type: String, required: true },
    description: String,
    price: Number,

    coverImage: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    file: {
      url: { type: String, required: true },
      publicId: { type: String, required: true },
    },

    createdBy: { type: String, required: true },
  },
  { timestamps: true }
);

export default mongoose.model<BookDocument>("Book", bookSchema);
