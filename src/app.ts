import express from "express";
import type { Request, Response } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRouter.js";
import bookRouter from "./book/bookRoutes.js";

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/", (_req: Request, res: Response) => {
  res.json({ 
    success: true,
    message: "Welcome to eLib API",
    version: "1.0.0"
  });
});

// Routes
app.use("/api/users", userRouter);
app.use("/api/books", bookRouter);

// 404 handler
app.use((_req: Request, _res: Response) => {
  throw createHttpError(404, "Route not found");
});

// Global error handler (must be last)
app.use(globalErrorHandler);

export default app; 