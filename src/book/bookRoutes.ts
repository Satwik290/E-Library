import express from "express";
import createBook from "./bookController.js";
const bookRouter = express.Router();

//routes
bookRouter.post("/", createBook);
// bookRouter.get("/login", loginUser);

export default bookRouter;
