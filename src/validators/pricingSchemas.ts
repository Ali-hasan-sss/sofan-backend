import { z } from "zod";
const packageDimensionsSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  quantity: z.number().int().positive().optional(),
});

const shipmentTypes = [
  "door_to_door",
  "branch_to_branch",
  "branch_to_door",
  "door_to_branch",
] as const;

export const pricingCalcSchema = z.object({
  originBranchId: z.string().min(1),
  destinationBranchId: z.string().min(1),
  shipmentType: z.enum(shipmentTypes),
  packages: z.array(packageDimensionsSchema).min(1),
  currency: z.string().min(2).optional(),
});

export const createVolumeRateSchema = z.object({
  originBranchId: z.string().min(1),
  destinationBranchId: z.string().min(1),
  localCurrency: z.string().min(2),
  pricePerCubicMeterLocal: z.number().nonnegative(),
  pricePerCubicMeterUsd: z.number().nonnegative(),
  pickupDoorFeeLocal: z.number().nonnegative().default(0),
  pickupDoorFeeUsd: z.number().nonnegative().default(0),
  deliveryDoorFeeLocal: z.number().nonnegative().default(0),
  deliveryDoorFeeUsd: z.number().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const updateVolumeRateSchema = createVolumeRateSchema
  .omit({ isActive: true })
  .partial()
  .extend({
    isActive: z.boolean().optional(),
    originBranchId: z.string().min(1).optional(),
    destinationBranchId: z.string().min(1).optional(),
  });
