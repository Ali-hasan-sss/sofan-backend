"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVolumeRateSchema = exports.createVolumeRateSchema = exports.pricingCalcSchema = void 0;
const zod_1 = require("zod");
const packageDimensionsSchema = zod_1.z.object({
    length: zod_1.z.number().positive(),
    width: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
});
const shipmentTypes = [
    "door_to_door",
    "branch_to_branch",
    "branch_to_door",
    "door_to_branch",
];
exports.pricingCalcSchema = zod_1.z.object({
    originBranchId: zod_1.z.string().min(1),
    destinationBranchId: zod_1.z.string().min(1),
    shipmentType: zod_1.z.enum(shipmentTypes),
    packages: zod_1.z.array(packageDimensionsSchema).min(1),
    currency: zod_1.z.string().min(2).optional(),
});
exports.createVolumeRateSchema = zod_1.z.object({
    originBranchId: zod_1.z.string().min(1),
    destinationBranchId: zod_1.z.string().min(1),
    localCurrency: zod_1.z.string().min(2),
    pricePerCubicMeterLocal: zod_1.z.number().nonnegative(),
    pricePerCubicMeterUsd: zod_1.z.number().nonnegative(),
    pickupDoorFeeLocal: zod_1.z.number().nonnegative().default(0),
    pickupDoorFeeUsd: zod_1.z.number().nonnegative().default(0),
    deliveryDoorFeeLocal: zod_1.z.number().nonnegative().default(0),
    deliveryDoorFeeUsd: zod_1.z.number().nonnegative().default(0),
    isActive: zod_1.z.boolean().default(true),
});
exports.updateVolumeRateSchema = exports.createVolumeRateSchema
    .omit({ isActive: true })
    .partial()
    .extend({
    isActive: zod_1.z.boolean().optional(),
    originBranchId: zod_1.z.string().min(1).optional(),
    destinationBranchId: zod_1.z.string().min(1).optional(),
});
//# sourceMappingURL=pricingSchemas.js.map