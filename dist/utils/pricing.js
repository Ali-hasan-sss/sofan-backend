"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.calculatePricing = void 0;
const CUBIC_DIVISOR = 1000000;
const shouldApplyPickupFee = (type) => type === "door_to_door" || type === "door_to_branch";
const shouldApplyDeliveryFee = (type) => type === "door_to_door" || type === "branch_to_door";
const normalizeCurrency = (currency) => currency ? currency.toUpperCase() : undefined;
const calculatePricing = (rate, input) => {
    const requestedCurrency = normalizeCurrency(input.currency);
    const isUsd = requestedCurrency === "USD";
    const currencyCode = isUsd ? "USD" : rate.localCurrency.toUpperCase();
    const pricePerCubicMeter = isUsd
        ? rate.pricePerCubicMeterUsd ?? rate.pricePerCubicMeterLocal ?? 0
        : rate.pricePerCubicMeterLocal ?? rate.pricePerCubicMeterUsd ?? 0;
    const pickupFeeBase = isUsd
        ? rate.pickupDoorFeeUsd ?? rate.pickupDoorFeeLocal ?? 0
        : rate.pickupDoorFeeLocal ?? rate.pickupDoorFeeUsd ?? 0;
    const deliveryFeeBase = isUsd
        ? rate.deliveryDoorFeeUsd ?? rate.deliveryDoorFeeLocal ?? 0
        : rate.deliveryDoorFeeLocal ?? rate.deliveryDoorFeeUsd ?? 0;
    const { volumetricCubicMeters, totalPackages } = input.packages.reduce((acc, pkg) => {
        const quantity = pkg.quantity ?? 1;
        const packageVolume = (pkg.length * pkg.width * pkg.height) / CUBIC_DIVISOR;
        return {
            volumetricCubicMeters: acc.volumetricCubicMeters + quantity * packageVolume,
            totalPackages: acc.totalPackages + quantity,
        };
    }, { volumetricCubicMeters: 0, totalPackages: 0 });
    const volumeCharge = volumetricCubicMeters * pricePerCubicMeter;
    const pickupFee = shouldApplyPickupFee(input.shipmentType)
        ? pickupFeeBase * totalPackages
        : 0;
    const deliveryFee = shouldApplyDeliveryFee(input.shipmentType)
        ? deliveryFeeBase * totalPackages
        : 0;
    const total = volumeCharge + pickupFee + deliveryFee;
    return {
        baseRate: 0,
        weightCharge: Number(volumeCharge.toFixed(2)),
        volumetricWeight: Number(volumetricCubicMeters.toFixed(4)),
        pickupFee: Number(pickupFee.toFixed(2)),
        deliveryFee: Number(deliveryFee.toFixed(2)),
        codFee: 0,
        insuranceFee: 0,
        currency: currencyCode,
        localCurrency: rate.localCurrency.toUpperCase(),
        total: Number(total.toFixed(2)),
    };
};
exports.calculatePricing = calculatePricing;
//# sourceMappingURL=pricing.js.map