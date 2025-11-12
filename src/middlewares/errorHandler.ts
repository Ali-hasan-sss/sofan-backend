import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { logger } from "../utils/logger";

interface ApiError extends Error {
  status?: number;
  details?: unknown;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const errorHandler = (
  err: ApiError,
  _req: Request,
  res: Response,
  _next: NextFunction
) => {
  const status = err.status ?? 500;

  if (err instanceof ZodError) {
    return res.status(400).json({
      message: "Validation failed",
      issues: err.flatten(),
    });
  }

  logger.error("Request error", {
    message: err.message,
    stack: err.stack,
    details: err.details,
  });

  return res.status(status).json({
    message: err.message ?? "Internal Server Error",
  });
};
