"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePricing = void 0;
const calculatePricing = (rule, input) => {
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
    const codFee = input.codAmount && input.codAmount > 0
        ? Math.round(input.codAmount * (rule.codFeePercent / 100)) + rule.codFeeFlat
        : 0;
    const insuranceFee = input.insured && input.codAmount
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
exports.calculatePricing = calculatePricing;
const resolveWeightRange = (ranges, weight) => {
    return ranges.find((range) => weight >= range.min && weight <= range.max);
};
//# sourceMappingURL=pricing.js.map