import { PricingRuleDocument, WeightRange } from "../models/PricingRule";
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

export const calculatePricing = (rule: PricingRuleDocument, input: PricingInput): PricingResult => {
  const volumetricWeight = input.packages.reduce((acc, pkg) => {
    return acc + pkg.length * pkg.width * pkg.height / rule.volumetricDivisor;
  }, 0);

  const actualWeight = input.packages.reduce((acc, pkg) => acc + pkg.weight, 0);
  const chargeableWeight = Math.max(actualWeight, volumetricWeight);

  const range = resolveWeightRange(rule.weightRanges, chargeableWeight);
  const weightCharge = Math.ceil(chargeableWeight) * (range?.ratePerKg ?? 0);

  const baseRate = rule.baseRate;
  const pickupFee = rule.pickupFee;
  const deliveryFee = rule.deliveryFee;
  const codFee =
    input.codAmount && input.codAmount > 0
      ? Math.round(input.codAmount * (rule.codFeePercent / 100)) + rule.codFeeFlat
      : 0;
  const insuranceFee =
    input.insured && input.codAmount
      ? Math.round(input.codAmount * (rule.insuranceRatePercent / 100))
      : 0;

  const total = baseRate + weightCharge + pickupFee + deliveryFee + codFee + insuranceFee;

  return {
    baseRate,
    weightCharge,
    volumetricWeight: Number(volumetricWeight.toFixed(2)),
    pickupFee,
    deliveryFee,
    codFee,
    insuranceFee,
    currency: rule.currency,
    total,
  };
};

const resolveWeightRange = (ranges: WeightRange[], weight: number) => {
  return ranges.find((range) => weight >= range.min && weight <= range.max);
};

