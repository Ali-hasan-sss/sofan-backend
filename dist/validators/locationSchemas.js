"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateVillageSchema = exports.createVillageSchema = exports.updateDistrictSchema = exports.createDistrictSchema = exports.updateProvinceSchema = exports.createProvinceSchema = void 0;
const zod_1 = require("zod");
exports.createProvinceSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    code: zod_1.z.string().min(1).optional(),
    country: zod_1.z.string().min(2).optional(),
});
exports.updateProvinceSchema = exports.createProvinceSchema.partial();
exports.createDistrictSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    code: zod_1.z.string().min(1).optional(),
    provinceId: zod_1.z.string().min(1),
    branchId: zod_1.z.string().min(1).optional(),
});
exports.updateDistrictSchema = exports.createDistrictSchema
    .omit({ provinceId: true })
    .partial()
    .extend({
    provinceId: zod_1.z.string().min(1).optional(),
});
exports.createVillageSchema = zod_1.z.object({
    name: zod_1.z.string().min(1),
    code: zod_1.z.string().min(1).optional(),
    districtId: zod_1.z.string().min(1),
    branchId: zod_1.z.string().min(1).optional(),
});
exports.updateVillageSchema = exports.createVillageSchema
    .omit({ districtId: true })
    .partial()
    .extend({
    districtId: zod_1.z.string().min(1).optional(),
});
//# sourceMappingURL=locationSchemas.js.map