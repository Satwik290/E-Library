import express from "express";
import type { Request, Response, NextFunction } from "express";
import createHttpError from "http-errors";
import globalErrorHandler from "./middlewares/globalErrorHandler.js";
import userRouter from "./user/userRouter.js";
const app = express();
app.use(express.json());


app.get("/", (req: Request, res: Response) => {
  const error = createHttpError(400, "something went wrong");
  throw error;

  res.json({ message: "welcome to elib apis" });
});

//routes
app.use('/api/users',userRouter);

//GlobalError
app.use(globalErrorHandler);

export default app;
