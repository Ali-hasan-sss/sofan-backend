import { z } from "zod";

export const countryCreateSchema = z.object({
  name: z.string().min(2).max(100),
  code: z.string().min(2).max(10),
  phoneCode: z.string().optional(),
  iso3: z.string().max(3).optional(),
});

export const countryUpdateSchema = z
  .object({
    name: z.string().min(2).max(100).optional(),
    code: z.string().min(2).max(10).optional(),
    phoneCode: z.string().optional(),
    iso3: z.string().max(3).optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "No country fields provided",
  });
