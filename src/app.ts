import express, { NextFunction, Request, Response, json } from "express";
import cookieParser from "cookie-parser";
import logger from "morgan";
import createHttpError from "http-errors";
import cors from "cors";
import corsOptions from "./config/corsOptions";

import routes from "./routes";
import PrismaErrorHandler from "./errors/PrismaErrorHandler";

const app = express();

app.use(logger("dev"));
app.use(cors(corsOptions));
app.use(json());
app.use(cookieParser());

// Set global variables for invoice ID number
app.locals.idNum;
app.locals.idDate;

app.use("/api/v1", routes);

const homeContent = `<h1>Node/Express REST API</h1><p>idNum: ${app.locals.idNum}</p><p>idDate: ${app.locals.idDate}</p>`;

app.get("/", (req, res) => {
  res.send(homeContent);
});

// Catch 404 and forward to error handler
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  next(createHttpError(404));
});

// Error handler
app.use(PrismaErrorHandler);

export default app;
