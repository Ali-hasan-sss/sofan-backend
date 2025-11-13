import { z } from "zod";
export declare const pricingCalcSchema: z.ZodObject<{
    originBranchId: z.ZodString;
    destinationBranchId: z.ZodString;
    shipmentType: z.ZodEnum<{
        door_to_door: "door_to_door";
        branch_to_branch: "branch_to_branch";
        branch_to_door: "branch_to_door";
        door_to_branch: "door_to_branch";
    }>;
    packages: z.ZodArray<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
    }, z.core.$strip>>;
    currency: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createVolumeRateSchema: z.ZodObject<{
    originBranchId: z.ZodString;
    destinationBranchId: z.ZodString;
    localCurrency: z.ZodString;
    pricePerCubicMeterLocal: z.ZodNumber;
    pricePerCubicMeterUsd: z.ZodNumber;
    pickupDoorFeeLocal: z.ZodDefault<z.ZodNumber>;
    pickupDoorFeeUsd: z.ZodDefault<z.ZodNumber>;
    deliveryDoorFeeLocal: z.ZodDefault<z.ZodNumber>;
    deliveryDoorFeeUsd: z.ZodDefault<z.ZodNumber>;
    isActive: z.ZodDefault<z.ZodBoolean>;
}, z.core.$strip>;
export declare const updateVolumeRateSchema: z.ZodObject<{
    localCurrency: z.ZodOptional<z.ZodString>;
    pricePerCubicMeterLocal: z.ZodOptional<z.ZodNumber>;
    pricePerCubicMeterUsd: z.ZodOptional<z.ZodNumber>;
    pickupDoorFeeLocal: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    pickupDoorFeeUsd: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deliveryDoorFeeLocal: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    deliveryDoorFeeUsd: z.ZodOptional<z.ZodDefault<z.ZodNumber>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    originBranchId: z.ZodOptional<z.ZodString>;
    destinationBranchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=pricingSchemas.d.ts.map