import "reflect-metadata";
import "dotenv/config";

import express, { Request, Response, NextFunction } from "express";
import "express-async-errors";

import cors from "cors";

import createConnection from "./database";
import AppError from "./errors/AppError";
import routes from "./routes";

createConnection();
const app = express();

app.use(express.json());
app.use(cors());
app.use(routes);

app.use((err: Error, request: Request, response: Response, _: NextFunction) => {
  if (err instanceof AppError) {
    return response.status(err.statusCode).json({
      status: "error",
      message: err.message,
    });
  }

  console.error(err);

  return response.status(500).json({
    status: "error",
    message: err,
  });
});

export default app;
