import { z } from "zod";
export declare const shipmentCreateSchema: z.ZodObject<{
    type: z.ZodEnum<{
        door_to_door: "door_to_door";
        branch_to_branch: "branch_to_branch";
        branch_to_door: "branch_to_door";
        door_to_branch: "door_to_branch";
    }>;
    branchFrom: z.ZodString;
    branchTo: z.ZodOptional<z.ZodString>;
    pricingCurrency: z.ZodString;
    sender: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
        provinceId: z.ZodOptional<z.ZodString>;
        districtId: z.ZodOptional<z.ZodString>;
        villageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    recipient: z.ZodObject<{
        name: z.ZodString;
        phone: z.ZodString;
        address: z.ZodString;
        provinceId: z.ZodOptional<z.ZodString>;
        districtId: z.ZodOptional<z.ZodString>;
        villageId: z.ZodOptional<z.ZodString>;
    }, z.core.$strip>;
    packages: z.ZodArray<z.ZodObject<{
        length: z.ZodNumber;
        width: z.ZodNumber;
        height: z.ZodNumber;
        weight: z.ZodNumber;
        declaredValue: z.ZodObject<{
            amount: z.ZodNumber;
            currency: z.ZodString;
        }, z.core.$strip>;
        goodsType: z.ZodString;
    }, z.core.$strip>>;
    codAmount: z.ZodOptional<z.ZodNumber>;
    codCurrency: z.ZodOptional<z.ZodString>;
    insured: z.ZodOptional<z.ZodBoolean>;
}, z.core.$strip>;
export declare const shipmentFilterSchema: z.ZodObject<{
    country: z.ZodOptional<z.ZodString>;
    branch: z.ZodOptional<z.ZodString>;
    status: z.ZodOptional<z.ZodEnum<{
        draft: "draft";
        pending_approval: "pending_approval";
        awaiting_pickup: "awaiting_pickup";
        in_transit: "in_transit";
        delivered: "delivered";
        cancelled: "cancelled";
    }>>;
}, z.core.$strip>;
//# sourceMappingURL=shipmentSchemas.d.ts.map