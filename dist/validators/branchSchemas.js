"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchUpdateSchema = exports.branchCreateSchema = void 0;
const zod_1 = require("zod");
exports.branchCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    country: zod_1.z.string().min(2),
    code: zod_1.z.string().min(2),
    address: zod_1.z.string().min(1),
    contactNumber: zod_1.z.string().optional(),
    isActive: zod_1.z.boolean().default(true),
    managerId: zod_1.z.string().optional(),
});
exports.branchUpdateSchema = exports.branchCreateSchema.partial().extend({
    isActive: zod_1.z.boolean().optional(),
    managerId: zod_1.z.string().nullable().optional(),
});
//# sourceMappingURL=branchSchemas.js.map