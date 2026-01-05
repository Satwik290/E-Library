import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/config.js";

/* =========================================================
   EXTENDED REQUEST TYPE
========================================================= */
export interface AuthRequest extends Request {
  userId: string;
}

/* =========================================================
   AUTH MIDDLEWARE
========================================================= */
const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader = req.header("Authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Authorization token is required"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createHttpError(401, "Invalid authorization format"));
  }

  try {
    const decoded = jwt.verify(token, config.jwtsecret as string) as JwtPayload;

    if (!decoded.sub) {
      return next(createHttpError(401, "Invalid token payload"));
    }

    (req as AuthRequest).userId = decoded.sub;

    next();
  } catch (error) {
    return next(createHttpError(401, "Token expired or invalid"));
  }
};

export default authenticate;
