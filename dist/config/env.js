"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const normalizeOrigin = (origin) => {
    if (!origin)
        return undefined;
    const trimmed = origin.trim();
    if (!trimmed)
        return undefined;
    const withProtocol = /^https?:\/\//i.test(trimmed)
        ? trimmed
        : `https://${trimmed}`;
    try {
        const url = new URL(withProtocol);
        return `${url.protocol}//${url.host}`;
    }
    catch {
        return undefined;
    }
};
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    MONGO_URI: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    ACCESS_TOKEN_TTL: zod_1.z.string().default("60m"),
    REFRESH_TOKEN_TTL: zod_1.z.string().default("7d"),
    DEFAULT_COUNTRY: zod_1.z.string().default("LB"),
    BASE_URL: zod_1.z.string().default("http://localhost:3000"),
    DEFAULT_ADMIN_EMAIL: zod_1.z.string().email().default("admin@sofan.com"),
    DEFAULT_ADMIN_PASSWORD: zod_1.z.string().min(8).default("ChangeMe!123"),
    CORS_ALLOWED_ORIGINS: zod_1.z
        .string()
        .default("http://localhost:3000,https://sofan.vercel.app")
        .transform((value) => value
        .split(",")
        .map((origin) => normalizeOrigin(origin))
        .filter((origin) => Boolean(origin))),
});
exports.env = EnvSchema.parse(process.env);
//# sourceMappingURL=env.js.map