"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceCreateSchema = void 0;
const zod_1 = require("zod");
const lineItemSchema = zod_1.z.object({
    shipment: zod_1.z.string(),
    description: zod_1.z.string().min(1),
    amount: zod_1.z.number().nonnegative(),
    currency: zod_1.z.string().min(2),
});
exports.invoiceCreateSchema = zod_1.z.object({
    user: zod_1.z.string(),
    branch: zod_1.z.string().optional(),
    country: zod_1.z.string().min(2),
    lineItems: zod_1.z.array(lineItemSchema).min(1),
    totalAmount: zod_1.z.number().nonnegative(),
    currency: zod_1.z.string().min(2),
    dueAt: zod_1.z.string().transform((value) => new Date(value)).optional(),
});
//# sourceMappingURL=invoiceSchemas.js.map