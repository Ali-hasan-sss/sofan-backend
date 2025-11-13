import { VolumeRateDocument } from "../models/VolumeRate";
import { ShipmentType } from "../types";

export interface VolumePricingInput {
  packages: Array<{
    length: number;
    width: number;
    height: number;
  }>;
  shipmentType: ShipmentType;
  currency?: string;
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
  localCurrency: string;
  total: number;
}

const CUBIC_DIVISOR = 1_000_000;

const shouldApplyPickupFee = (type: ShipmentType) =>
  type === "door_to_door" || type === "door_to_branch";

const shouldApplyDeliveryFee = (type: ShipmentType) =>
  type === "door_to_door" || type === "branch_to_door";

const normalizeCurrency = (currency?: string) =>
  currency ? currency.toUpperCase() : undefined;

export const calculatePricing = (
  rate: VolumeRateDocument,
  input: VolumePricingInput
): PricingResult => {
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

  const volumetricCubicMeters = input.packages.reduce((acc, pkg) => {
    return acc + (pkg.length * pkg.width * pkg.height) / CUBIC_DIVISOR;
  }, 0);

  const volumeCharge = volumetricCubicMeters * pricePerCubicMeter;
  const pickupFee = shouldApplyPickupFee(input.shipmentType)
    ? pickupFeeBase
    : 0;
  const deliveryFee = shouldApplyDeliveryFee(input.shipmentType)
    ? deliveryFeeBase
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
