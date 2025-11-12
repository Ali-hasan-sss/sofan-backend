import jwt from "jsonwebtoken";
import type { StringValue } from "ms";
import { env } from "../config/env";

export interface TokenPayload {
  userId: string;
  id: string;
  roles: string[];
  country: string;
}

const normalizeExpiresIn = (value: string): number | StringValue => {
  const trimmed = value.trim();
  if (/^\d+$/.test(trimmed)) {
    return Number(trimmed);
  }
  if (/^\d+\s*[a-zA-Z]+$/.test(trimmed)) {
    return trimmed as StringValue;
  }
  throw new Error(`Invalid expiresIn format: ${value}`);
};

const accessTokenExpiry = normalizeExpiresIn(env.ACCESS_TOKEN_TTL);
const refreshTokenExpiry = normalizeExpiresIn(env.REFRESH_TOKEN_TTL);

export const signAccessToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_ACCESS_SECRET, { expiresIn: accessTokenExpiry });

export const signRefreshToken = (payload: TokenPayload) =>
  jwt.sign(payload, env.JWT_REFRESH_SECRET, { expiresIn: refreshTokenExpiry });

export const verifyAccessToken = (token: string) =>
  jwt.verify(token, env.JWT_ACCESS_SECRET) as TokenPayload;

export const verifyRefreshToken = (token: string) =>
  jwt.verify(token, env.JWT_REFRESH_SECRET) as TokenPayload;
