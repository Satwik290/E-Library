import type { User } from "../user/userTypes.js";
export interface Book {
    id: string;
    title: string;
    author: User;
    genre: string;
    coverImage:string;
    file: string;
    createdAt: Date;
    updatedAt: Date;
};