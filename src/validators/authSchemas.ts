import { z } from "zod";
import { ROLES } from "../types/roles";

const userRoles = [ROLES.USER_PERSONAL, ROLES.USER_BUSINESS] as const;

const emailSchema = z
  .string()
  .email()
  .transform((value) => value.trim().toLowerCase());

export const registerSchema = z.object({
  email: emailSchema,
  password: z.string().min(8),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(userRoles),
  verificationToken: z.string().min(10),
  locale: z.enum(["ar", "en"]).default("ar"),
  country: z.string().min(2).optional(),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1),
});

export const refreshSchema = z.object({
  refreshToken: z.string().min(10),
});

export const checkEmailSchema = z.object({
  email: emailSchema,
});

export const sendVerificationCodeSchema = checkEmailSchema;

export const verifyCodeSchema = checkEmailSchema.extend({
  code: z.string().min(4).max(6),
});
