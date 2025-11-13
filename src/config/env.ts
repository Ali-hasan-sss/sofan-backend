import { config } from "dotenv";
import { z } from "zod";

config();

const normalizeOrigin = (origin: string) => {
  if (!origin) return undefined;
  const trimmed = origin.trim();
  if (!trimmed) return undefined;
  const withProtocol = /^https?:\/\//i.test(trimmed)
    ? trimmed
    : `https://${trimmed}`;
  try {
    const url = new URL(withProtocol);
    return `${url.protocol}//${url.host}`;
  } catch {
    return undefined;
  }
};

const EnvSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  PORT: z.coerce.number().default(4000),
  MONGO_URI: z.string(),
  JWT_ACCESS_SECRET: z.string(),
  JWT_REFRESH_SECRET: z.string(),
  ACCESS_TOKEN_TTL: z.string().default("60m"),
  REFRESH_TOKEN_TTL: z.string().default("7d"),
  DEFAULT_COUNTRY: z.string().default("LB"),
  BASE_URL: z.string().default("http://localhost:3000"),
  DEFAULT_ADMIN_EMAIL: z.string().email().default("admin@sofan.com"),
  DEFAULT_ADMIN_PASSWORD: z.string().min(8).default("ChangeMe!123"),
  CORS_ALLOWED_ORIGINS: z
    .string()
    .default("http://localhost:3000,https://sofan.vercel.app")
    .transform((value) =>
      value
        .split(",")
        .map((origin) => normalizeOrigin(origin))
        .filter((origin): origin is string => Boolean(origin))
    ),
});

export type Env = z.infer<typeof EnvSchema>;

export const env: Env = EnvSchema.parse(process.env);
