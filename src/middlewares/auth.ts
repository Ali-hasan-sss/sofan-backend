import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/token";

export const authenticate =
  (optional = false) =>
  (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    const token = authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : req.cookies?.accessToken;

    if (!token) {
      if (optional) {
        return next();
      }
      return res.status(401).json({ message: "Unauthorized" });
    }

    try {
      const payload = verifyAccessToken(token);
      req.user = { ...payload, id: payload.id ?? payload.userId };
      return next();
    } catch (error) {
      if (optional) return next();
      return res.status(401).json({ message: "Invalid token" });
    }
  };
