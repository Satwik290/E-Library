import express from "express";
import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
const app = express();


app.get("/", (req: Request, res: Response) => {
  const error = createHttpError(400, "something went wrong");
  throw error;

  res.json({ message: "welcome to elib apis" });
});

app.use(globalErrorHandler);

export default app;
