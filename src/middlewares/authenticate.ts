import type { NextFunction, Request, Response } from "express";
import createHttpError from "http-errors";
import jwt, { type JwtPayload } from "jsonwebtoken";
import { config } from "../config/config.js";

const authenticate = (
  req: Request,
  _res: Response,
  next: NextFunction
) => {
  const authHeader =
    req.headers.authorization || req.headers.Authorization;

  if (!authHeader || typeof authHeader !== "string") {
    return next(createHttpError(401, "Authorization token is required"));
  }

  if (!authHeader.startsWith("Bearer ")) {
    return next(createHttpError(401, "Invalid authorization format"));
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    return next(createHttpError(401, "Invalid authorization token"));
  }

  /* ✅ GUARANTEE SECRET EXISTS */
  const jwtSecret = config.jwtsecret;
  if (!jwtSecret) {
    throw new Error("JWT secret is not configured");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as JwtPayload;

    if (!decoded.sub) {
      return next(createHttpError(401, "Invalid token payload"));
    }

    req.userId = decoded.sub;
    next();
  } catch {
    return next(createHttpError(401, "Token expired or invalid"));
  }
};

export default authenticate;
