"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingRuleSchema = exports.pricingCalcSchema = void 0;
const zod_1 = require("zod");
const weightRangeSchema = zod_1.z.object({
    min: zod_1.z.number().nonnegative(),
    max: zod_1.z.number().positive(),
    ratePerKg: zod_1.z.number().nonnegative(),
});
exports.pricingCalcSchema = zod_1.z.object({
    pricingRuleId: zod_1.z.string().optional(),
    packages: zod_1.z
        .array(zod_1.z.object({
        length: zod_1.z.number().positive(),
        width: zod_1.z.number().positive(),
        height: zod_1.z.number().positive(),
        weight: zod_1.z.number().positive(),
    }))
        .min(1),
    codAmount: zod_1.z.number().nonnegative().optional(),
    insured: zod_1.z.boolean().optional(),
});
exports.pricingRuleSchema = zod_1.z.object({
    country: zod_1.z.string().min(2),
    branch: zod_1.z.string().optional(),
    currency: zod_1.z.string().min(2),
    volumetricDivisor: zod_1.z.number().positive(),
    pickupFee: zod_1.z.number().nonnegative().default(0),
    deliveryFee: zod_1.z.number().nonnegative().default(0),
    codFeePercent: zod_1.z.number().nonnegative().default(0),
    codFeeFlat: zod_1.z.number().nonnegative().default(0),
    insuranceRatePercent: zod_1.z.number().nonnegative().default(0),
    weightRanges: zod_1.z.array(weightRangeSchema).min(1),
    baseRate: zod_1.z.number().nonnegative().default(0),
});
//# sourceMappingURL=pricingSchemas.js.map