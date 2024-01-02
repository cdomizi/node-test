import cookieParser from "cookie-parser";
import cors from "cors";
import express, { NextFunction, Request, Response, json } from "express";
import createHttpError from "http-errors";
import logger from "morgan";
import { corsOptions } from "./config/corsOptions";

import { PrismaErrorHandler } from "./middleware/PrismaErrorHandler";
import { routes } from "./routes/index";

export const app = express();

app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Node/Express REST API");
});

// Catch not-found-error and forward to error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

// Error handler
app.use(PrismaErrorHandler);
