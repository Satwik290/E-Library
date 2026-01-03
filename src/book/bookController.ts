import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";

const createBook = async (req: Request, res: Response, next: NextFunction) => {
    res.json({});
};


export default createBook;