import express, { NextFunction, Request, Response, json } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createHttpError from "http-errors";
import cors from "cors";
import corsOptions from "./config/corsOptions";

import routes from "./routes";
import PrismaErrorHandler from "./middleware/errors/PrismaErrorHandler";

const app = express();

app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

app.use("/api/v1", routes);

app.get("/", (req, res) => {
  res.send("Node/Express REST API");
});

// Catch 404 and forward to error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

// Error handler
app.use(PrismaErrorHandler);

export default app;
