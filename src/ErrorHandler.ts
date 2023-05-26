import { NextFunction, Request, Response } from "express";

interface Error {
  statusCode?: number;
  message?: string;
  stack?: string | undefined;
}

const ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err || err.statusCode === 404) {
    const message = `404: Invalid path "${req.path}"`;

    console.error(message);
    res.status(404).send(message);
  } else {
    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    console.error(`${statusCode}: ${message}`, err.stack);
    res.status(statusCode).send(message);
  }
};

export default ErrorHandler;
