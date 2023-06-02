import { Request, Response, NextFunction } from "express";
import { Prisma } from "@prisma/client";
import CustomError from "./CustomError";

const handlePrismaError = (err: Prisma.PrismaClientKnownRequestError) => {
  switch (err.code) {
    case "P2001":
      // Non-existent ID error
      return new CustomError(`${err?.meta?.cause || "ID not found"}`, 400);
    case "P2002":
      // Duplicate key error
      return new CustomError(
        `Duplicate field value: ${err?.meta?.target}`,
        400
      );
    case "P2005":
      // Invalid data error
      return new CustomError(`Invalid input data: ${err?.meta?.target}`, 400);
    case "P2025":
      // Non-existent ID error
      return new CustomError(`${err?.meta?.cause || "ID not found"}`, 400);
    default:
      // All other errors
      return new CustomError(`Something went wrong: ${err?.message}`, 500);
  }
};

const PrismaErrorHandler = (
  err: Prisma.PrismaClientKnownRequestError,
  req?: Request,
  res?: Response,
  next?: NextFunction // eslint-disable-line @typescript-eslint/no-unused-vars
) => {
  const error = handlePrismaError(err);
  console.error(error);
  res?.status(error.statusCode).send({ message: error?.message });
};

export default PrismaErrorHandler;
