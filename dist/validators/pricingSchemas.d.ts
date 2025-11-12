import { z } from "zod";
export declare const pricingCalcSchema: z.ZodObject<{
    pricingRuleId: z.ZodOptional<z.ZodString>;
    packages: z.ZodArray<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        weight: z.ZodNumber;
    }, z.core.$strip>>;
    codAmount: z.ZodOptional<z.ZodNumber>;
    insured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const pricingRuleSchema: z.ZodObject<{
    country: z.ZodString;
    branch: z.ZodOptional<z.ZodString>;
    currency: z.ZodString;
    volumetricDivisor: z.ZodNumber;
    pickupFee: z.ZodDefault<z.ZodNumber>;
    deliveryFee: z.ZodDefault<z.ZodNumber>;
    codFeePercent: z.ZodDefault<z.ZodNumber>;
    codFeeFlat: z.ZodDefault<z.ZodNumber>;
    insuranceRatePercent: z.ZodDefault<z.ZodNumber>;
    weightRanges: z.ZodArray<z.ZodObject<{
        min: z.ZodNumber;
        max: z.ZodNumber;
        ratePerKg: z.ZodNumber;
    }, z.core.$strip>>;
    baseRate: z.ZodDefault<z.ZodNumber>;
}, z.core.$strip>;
//# sourceMappingURL=pricingSchemas.d.ts.map