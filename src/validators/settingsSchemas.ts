import { z } from "zod";

const currencyCodeSchema = z
  .string()
  .trim()
  .min(3, "Currency code must be at least 3 characters")
  .max(6, "Currency code must be at most 6 characters")
  .regex(/^[A-Za-z]+$/, "Currency code must contain only letters")
  .transform((value) => value.toUpperCase());

export const systemSettingsUpdateSchema = z.object({
  localCurrency: z
    .union([currencyCodeSchema, z.literal(""), z.null()])
    .optional()
    .transform((value) => {
      if (value === "" || value === null || value === undefined) {
        return null;
      }
      return value;
    }),
});
