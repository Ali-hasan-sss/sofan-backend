import {
  pricingCalcSchema,
  createVolumeRateSchema,
  updateVolumeRateSchema,
} from "../validators/pricingSchemas";
import { VolumeRateModel } from "../models/VolumeRate";
import { calculatePricing } from "../utils/pricing";

const httpError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

const coerceNumber = (value: any, fallback = 0) => {
  if (typeof value === "number" && Number.isFinite(value)) return value;
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
};

const mapVolumeRate = (rate: any) => {
  const localCurrency =
    rate.localCurrency ?? rate.currency ?? rate.currencyLocal ?? "USD";
  const pricePerCubicMeterLocal = coerceNumber(
    rate.pricePerCubicMeterLocal ?? rate.pricePerCubicMeter
  );
  const pricePerCubicMeterUsd = coerceNumber(
    rate.pricePerCubicMeterUsd,
    pricePerCubicMeterLocal
  );
  const pickupDoorFeeLocal = coerceNumber(
    rate.pickupDoorFeeLocal ?? rate.pickupDoorFee
  );
  const pickupDoorFeeUsd = coerceNumber(
    rate.pickupDoorFeeUsd,
    pickupDoorFeeLocal
  );
  const deliveryDoorFeeLocal = coerceNumber(
    rate.deliveryDoorFeeLocal ?? rate.deliveryDoorFee
  );
  const deliveryDoorFeeUsd = coerceNumber(
    rate.deliveryDoorFeeUsd,
    deliveryDoorFeeLocal
  );

  return {
    id: rate._id.toString(),
    originBranch: rate.originBranch
      ? {
          id:
            rate.originBranch._id?.toString?.() ??
            rate.originBranch.id?.toString?.() ??
            rate.originBranch.toString(),
          name: rate.originBranch.name,
          code: rate.originBranch.code,
        }
      : undefined,
    destinationBranch: rate.destinationBranch
      ? {
          id:
            rate.destinationBranch._id?.toString?.() ??
            rate.destinationBranch.id?.toString?.() ??
            rate.destinationBranch.toString(),
          name: rate.destinationBranch.name,
          code: rate.destinationBranch.code,
        }
      : undefined,
    localCurrency: localCurrency.toUpperCase(),
    pricePerCubicMeterLocal,
    pricePerCubicMeterUsd,
    pickupDoorFeeLocal,
    pickupDoorFeeUsd,
    deliveryDoorFeeLocal,
    deliveryDoorFeeUsd,
    isActive: rate.isActive ?? true,
    createdAt: rate.createdAt,
    updatedAt: rate.updatedAt,
  };
};

export const pricingService = {
  calculate: async ({ payload }: { payload: unknown }) => {
    const data = pricingCalcSchema.parse(payload);

    const rate = await VolumeRateModel.findOne({
      originBranch: data.originBranchId,
      destinationBranch: data.destinationBranchId,
      isActive: true,
    })
      .populate({ path: "originBranch", select: "name code" })
      .populate({ path: "destinationBranch", select: "name code" });

    if (!rate) {
      throw httpError("Pricing rate not configured for selected branches", 404);
    }

    const currency = data.currency ? data.currency.toUpperCase() : undefined;

    return calculatePricing(rate, {
      packages: data.packages,
      shipmentType: data.shipmentType,
      currency,
    });
  },

  listRates: async () => {
    const rates = await VolumeRateModel.find()
      .populate({ path: "originBranch", select: "name code" })
      .populate({ path: "destinationBranch", select: "name code" })
      .sort({ createdAt: -1 })
      .lean();
    return rates.map(mapVolumeRate);
  },

  createRate: async (payload: unknown) => {
    const data = createVolumeRateSchema.parse(payload);

    const existing = await VolumeRateModel.findOne({
      originBranch: data.originBranchId,
      destinationBranch: data.destinationBranchId,
    });

    if (existing) {
      throw httpError(
        "Pricing rate already configured for this branch pair",
        409
      );
    }

    const rate = await VolumeRateModel.create({
      originBranch: data.originBranchId,
      destinationBranch: data.destinationBranchId,
      localCurrency: data.localCurrency.toUpperCase(),
      pricePerCubicMeterLocal: data.pricePerCubicMeterLocal,
      pricePerCubicMeterUsd: data.pricePerCubicMeterUsd,
      pickupDoorFeeLocal: data.pickupDoorFeeLocal,
      pickupDoorFeeUsd: data.pickupDoorFeeUsd,
      deliveryDoorFeeLocal: data.deliveryDoorFeeLocal,
      deliveryDoorFeeUsd: data.deliveryDoorFeeUsd,
      isActive: data.isActive,
    });

    const populated = await VolumeRateModel.findById(rate._id)
      .populate({ path: "originBranch", select: "name code" })
      .populate({ path: "destinationBranch", select: "name code" })
      .lean();

    return populated ? mapVolumeRate(populated) : mapVolumeRate(rate);
  },

  updateRate: async (id: string, payload: unknown) => {
    const data = updateVolumeRateSchema.parse(payload);

    const current = await VolumeRateModel.findById(id);
    if (!current) {
      throw httpError("Pricing rate not found", 404);
    }

    const targetOrigin = data.originBranchId ?? current.originBranch.toString();
    const targetDestination =
      data.destinationBranchId ?? current.destinationBranch.toString();

    const duplicate = await VolumeRateModel.findOne({
      _id: { $ne: id },
      originBranch: targetOrigin,
      destinationBranch: targetDestination,
    });
    if (duplicate) {
      throw httpError(
        "Pricing rate already configured for this branch pair",
        409
      );
    }

    const rate = await VolumeRateModel.findByIdAndUpdate(
      id,
      {
        $set: {
          ...(data.originBranchId ? { originBranch: data.originBranchId } : {}),
          ...(data.destinationBranchId
            ? { destinationBranch: data.destinationBranchId }
            : {}),
          ...(data.localCurrency
            ? { localCurrency: data.localCurrency.toUpperCase() }
            : {}),
          ...(data.pricePerCubicMeterLocal !== undefined
            ? { pricePerCubicMeterLocal: data.pricePerCubicMeterLocal }
            : {}),
          ...(data.pricePerCubicMeterUsd !== undefined
            ? { pricePerCubicMeterUsd: data.pricePerCubicMeterUsd }
            : {}),
          ...(data.pickupDoorFeeLocal !== undefined
            ? { pickupDoorFeeLocal: data.pickupDoorFeeLocal }
            : {}),
          ...(data.pickupDoorFeeUsd !== undefined
            ? { pickupDoorFeeUsd: data.pickupDoorFeeUsd }
            : {}),
          ...(data.deliveryDoorFeeLocal !== undefined
            ? { deliveryDoorFeeLocal: data.deliveryDoorFeeLocal }
            : {}),
          ...(data.deliveryDoorFeeUsd !== undefined
            ? { deliveryDoorFeeUsd: data.deliveryDoorFeeUsd }
            : {}),
          ...(data.isActive !== undefined ? { isActive: data.isActive } : {}),
        },
      },
      { new: true }
    )
      .populate({ path: "originBranch", select: "name code" })
      .populate({ path: "destinationBranch", select: "name code" })
      .lean();

    if (!rate) {
      throw httpError("Pricing rate not found", 404);
    }

    return mapVolumeRate(rate);
  },

  removeRate: async (id: string) => {
    const deleted = await VolumeRateModel.findByIdAndDelete(id).lean();
    if (!deleted) {
      throw httpError("Pricing rate not found", 404);
    }
    return { id, deleted: true };
  },
};
