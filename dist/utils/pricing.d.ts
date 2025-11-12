import { PricingRuleDocument } from "../models/PricingRule";
import { Dimensions } from "../types";
export interface PricingInput {
    packages: Dimensions[];
    codAmount?: number;
    insured?: boolean;
}
export interface PricingResult {
    baseRate: number;
    weightCharge: number;
    volumetricWeight: number;
    pickupFee: number;
    deliveryFee: number;
    codFee: number;
    insuranceFee: number;
    currency: string;
    total: number;
}
export declare const calculatePricing: (rule: PricingRuleDocument, input: PricingInput) => PricingResult;
//# sourceMappingURL=pricing.d.ts.map