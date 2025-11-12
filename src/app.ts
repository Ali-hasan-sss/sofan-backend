import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { env } from "./config/env";
import { logger } from "./utils/logger";
import apiRouter from "./routes";
import { errorHandler } from "./middlewares/errorHandler";

export const createApp = () => {
  const app = express();

  app.use(
    cors({
      origin: ["https://sofan.vercel.app", "http://localhost:3000"],
      credentials: true,
    })
  );

  app.set("trust proxy", 1);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));
  app.use(cookieParser());

  app.options(
    "*",
    cors({
      origin: ["https://sofan.vercel.app", "http://localhost:3000"],
      credentials: true,
    })
  );

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
