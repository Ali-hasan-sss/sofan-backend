import { z } from "zod";
import { ROLES } from "../types/roles";

const roleValues = Object.values(ROLES) as [string, ...string[]];

const adminEmailSchema = z
  .string()
  .email()
  .transform((value) => value.trim().toLowerCase());

export const adminCreateUserSchema = z.object({
  email: adminEmailSchema,
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  role: z.enum(roleValues),
  country: z.string().min(2).optional(),
  password: z.string().min(8),
});

export const adminUpdateUserSchema = z
  .object({
    email: adminEmailSchema.optional(),
    firstName: z.string().min(1).optional(),
    lastName: z.string().min(1).optional(),
    role: z.enum(roleValues).optional(),
    country: z.string().min(2).optional(),
    password: z.string().min(8).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
  });
