import { z } from "zod";
declare const EnvSchema: z.ZodObject<{
    NODE_ENV: z.ZodDefault<z.ZodEnum<{
        development: "development";
        test: "test";
        production: "production";
    }>>;
    PORT: z.ZodDefault<z.ZodCoercedNumber<unknown>>;
    MONGO_URI: z.ZodString;
    JWT_ACCESS_SECRET: z.ZodString;
    JWT_REFRESH_SECRET: z.ZodString;
    ACCESS_TOKEN_TTL: z.ZodDefault<z.ZodString>;
    REFRESH_TOKEN_TTL: z.ZodDefault<z.ZodString>;
    DEFAULT_COUNTRY: z.ZodDefault<z.ZodString>;
    BASE_URL: z.ZodDefault<z.ZodString>;
    DEFAULT_ADMIN_EMAIL: z.ZodDefault<z.ZodString>;
    DEFAULT_ADMIN_PASSWORD: z.ZodDefault<z.ZodString>;
}, z.core.$strip>;
export type Env = z.infer<typeof EnvSchema>;
export declare const env: Env;
export {};
//# sourceMappingURL=env.d.ts.map