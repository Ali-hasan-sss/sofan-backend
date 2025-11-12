import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  app.set("trust proxy", 1);

  const normalizeOrigin = (input?: string | null) => {
    if (!input) return undefined;
    const trimmed = input.trim();
    if (!trimmed) return undefined;
    const withProtocol = /^https?:\/\//i.test(trimmed)
      ? trimmed
      : `https://${trimmed}`;
    try {
      const url = new URL(withProtocol);
      return `${url.protocol}//${url.host}`.toLowerCase();
    } catch {
      return undefined;
    }
  };

  const allowedOrigins = env.CORS_ALLOWED_ORIGINS.map((origin) =>
    normalizeOrigin(origin)
  ).filter((origin): origin is string => Boolean(origin));
  const allowedOriginSet = new Set(allowedOrigins);

  app.use(
    cors({
      origin: (origin, callback) => {
        if (!origin) {
          return callback(null, true);
        }

        const normalizedOrigin = normalizeOrigin(origin);
        if (normalizedOrigin && allowedOriginSet.has(normalizedOrigin)) {
          return callback(null, normalizedOrigin);
        }

        return callback(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      optionsSuccessStatus: 204,
    })
  );
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.get("/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  app.use("/api", apiRouter);

  app.use((_req, res) => {
    res.status(404).json({ message: "Not Found" });
  });

  app.use(errorHandler);

  app.on("mount", () => {
    logger.info("Express app mounted");
  });

  return app;
};
