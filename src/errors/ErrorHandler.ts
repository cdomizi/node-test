import { Request, Response, NextFunction } from "express";

interface Error {
  statusCode?: number;
  message?: string;
  stack?: string | undefined;
}

const ErrorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const error = {
    statusCode: err?.statusCode || 500,
    message: err?.message || "Internal Server Error",
  };

  console.error(`${error.statusCode}: ${error.message}`);
  console.error(err.stack);
  return res.status(error.statusCode).send(error.message);
};

export default ErrorHandler;
