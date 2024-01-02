import { ErrorRequestHandler } from "express";
import { Prisma } from "../.prisma/client";
import { CustomError } from "../utils/CustomError";
import { capitalize } from "../utils/formattingHelper";

declare class PrismaRequestErrorWithTarget extends Prisma.PrismaClientKnownRequestError {
  meta?:
    | ({
        cause?: string;
        model_name?: string;
        argument_name?: string;
        argument_value?: string;
        field_name?: string;
        field_value?: string;
        object_name?: string;
        target?: string;
      } & Record<string, unknown>)
    | undefined;
}

const handlePrismaError = (err: PrismaRequestErrorWithTarget) => {
  switch (err.code) {
    case "P2001":
      // Non-existent field error
      return new CustomError(
        `${capitalize(err?.meta?.model_name || "item")} with ${
          err?.meta?.argument_name || "field"
        } "${err?.meta?.argument_value || undefined}" not found`,
        404,
      );
    case "P2002":
      // Duplicate key error
      return new CustomError(
        `"Duplicate field value: ${err?.meta?.target}`,
        400,
      );
    case "P2006":
      // Invalid value error
      return new CustomError(
        `The provided value ${err?.meta?.field_value || ""} for ${
          err?.meta?.model_name || "the item"
        } field ${err?.meta?.field_name || ""} is not valid`,
        400,
      );
    case "P2012":
      // Missing value error
      return new CustomError(
        `The provided value ${err?.meta?.field_value || ""} for ${
          err?.meta?.model_name || "the item"
        } field ${err?.meta?.field_name || ""} is not valid`,
        400,
      );
    case "P2013":
      // Missing required field
      return new CustomError(
        `Missing the required argument ${
          err?.meta?.argument_name || ""
        } for field ${err?.meta?.field_name || "the item"} on ${
          err?.meta?.object_name || ""
        }`,
        400,
      );
    case "P2020":
      // Value out of range error
      return new CustomError("Value out of range for the type", 400);
    case "P2025":
      // Non-existent ID error
      return new CustomError(`${err?.meta?.cause || "ID not found"}`, 404);
    default:
      // All other errors
      return new CustomError("Something went wrong" + err?.message, 500);
  }
};

export const PrismaErrorHandler: ErrorRequestHandler = (err, req, res) => {
  const error =
    err instanceof Prisma.PrismaClientKnownRequestError
      ? handlePrismaError(err)
      : new CustomError();

  console.error(error);
  res?.status(error.statusCode).send(error.message);
};
