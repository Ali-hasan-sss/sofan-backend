import { z } from "zod";

const weightRangeSchema = z.object({
  min: z.number().nonnegative(),
  max: z.number().positive(),
  ratePerKg: z.number().nonnegative(),
});

export const pricingCalcSchema = z.object({
  pricingRuleId: z.string().optional(),
  packages: z
    .array(
      z.object({
        length: z.number().positive(),
        width: z.number().positive(),
        height: z.number().positive(),
        weight: z.number().positive(),
      })
    )
    .min(1),
  codAmount: z.number().nonnegative().optional(),
  insured: z.boolean().optional(),
});

export const pricingRuleSchema = z.object({
  country: z.string().min(2),
  branch: z.string().optional(),
  currency: z.string().min(2),
  volumetricDivisor: z.number().positive(),
  pickupFee: z.number().nonnegative().default(0),
  deliveryFee: z.number().nonnegative().default(0),
  codFeePercent: z.number().nonnegative().default(0),
  codFeeFlat: z.number().nonnegative().default(0),
  insuranceRatePercent: z.number().nonnegative().default(0),
  weightRanges: z.array(weightRangeSchema).min(1),
  baseRate: z.number().nonnegative().default(0),
});
