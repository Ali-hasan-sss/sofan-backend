"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentFilterSchema = exports.shipmentCreateSchema = void 0;
const zod_1 = require("zod");
const moneySchema = zod_1.z.object({
    amount: zod_1.z.number().nonnegative(),
    currency: zod_1.z.string().min(2),
});
const addressSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    phone: zod_1.z.string().min(5),
    address: zod_1.z.string().min(5),
    provinceId: zod_1.z.string().min(1).optional(),
    districtId: zod_1.z.string().min(1).optional(),
    villageId: zod_1.z.string().min(1).optional(),
});
const packageSchema = zod_1.z.object({
    quantity: zod_1.z.number().int().positive().default(1),
    length: zod_1.z.number().positive(),
    width: zod_1.z.number().positive(),
    height: zod_1.z.number().positive(),
    weight: zod_1.z.number().positive(),
    declaredValue: moneySchema,
    goodsType: zod_1.z.string().min(1),
});
const paymentMethodEnum = zod_1.z.enum([
    "prepaid",
    "cod",
    "contract",
    "wallet",
]);
exports.shipmentCreateSchema = zod_1.z.object({
    type: zod_1.z.enum([
        "door_to_door",
        "branch_to_branch",
        "branch_to_door",
        "door_to_branch",
    ]),
    branchFrom: zod_1.z.string().min(1),
    branchTo: zod_1.z.string().optional(),
    pricingCurrency: zod_1.z.string().min(2),
    sender: addressSchema,
    recipient: addressSchema,
    packages: zod_1.z.array(packageSchema).min(1),
    paymentMethod: paymentMethodEnum,
    isFragile: zod_1.z.boolean().default(false),
    additionalInfo: zod_1.z.string().max(1000).optional(),
    goodsValue: moneySchema.optional(),
    codAmount: zod_1.z.number().nonnegative().optional(),
    codCurrency: zod_1.z.string().min(2).optional(),
    insured: zod_1.z.boolean().optional(),
});
exports.shipmentFilterSchema = zod_1.z.object({
    country: zod_1.z.string().optional(),
    branch: zod_1.z.string().optional(),
    status: zod_1.z
        .enum([
        "draft",
        "pending_approval",
        "awaiting_pickup",
        "in_transit",
        "delivered",
        "cancelled",
    ])
        .optional(),
});
//# sourceMappingURL=shipmentSchemas.js.map