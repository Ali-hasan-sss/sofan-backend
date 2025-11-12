"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const dotenv_1 = require("dotenv");
const zod_1 = require("zod");
(0, dotenv_1.config)();
const EnvSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "test", "production"])
        .default("development"),
    PORT: zod_1.z.coerce.number().default(4000),
    MONGO_URI: zod_1.z.string(),
    JWT_ACCESS_SECRET: zod_1.z.string(),
    JWT_REFRESH_SECRET: zod_1.z.string(),
    ACCESS_TOKEN_TTL: zod_1.z.string().default("15m"),
    REFRESH_TOKEN_TTL: zod_1.z.string().default("7d"),
    DEFAULT_COUNTRY: zod_1.z.string().default("LB"),
    BASE_URL: zod_1.z.string().default("http://localhost:4000"),
    DEFAULT_ADMIN_EMAIL: zod_1.z.string().email().default("admin@sofan.com"),
    DEFAULT_ADMIN_PASSWORD: zod_1.z.string().min(8).default("ChangeMe!123"),
});
exports.env = EnvSchema.parse(process.env);
//# sourceMappingURL=env.js.map