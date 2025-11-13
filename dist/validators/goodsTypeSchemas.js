"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.goodsTypeUpdateSchema = exports.goodsTypeCreateSchema = void 0;
const zod_1 = require("zod");
exports.goodsTypeCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    description: zod_1.z.string().max(500).optional(),
    isActive: zod_1.z.boolean().optional(),
});
exports.goodsTypeUpdateSchema = exports.goodsTypeCreateSchema.partial();
//# sourceMappingURL=goodsTypeSchemas.js.map