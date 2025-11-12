import { Document, Types } from "mongoose";
export interface WeightRange {
    min: number;
    max: number;
    ratePerKg: number;
}
export interface PricingRuleDocument extends Document {
    country: string;
    branch?: Types.ObjectId;
    currency: string;
    volumetricDivisor: number;
    pickupFee: number;
    deliveryFee: number;
    codFeePercent: number;
    codFeeFlat: number;
    insuranceRatePercent: number;
    weightRanges: WeightRange[];
    baseRate: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const PricingRuleModel: import("mongoose").Model<PricingRuleDocument, {}, {}, {}, Document<unknown, {}, PricingRuleDocument, {}, {}> & PricingRuleDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=PricingRule.d.ts.map