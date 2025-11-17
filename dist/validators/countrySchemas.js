"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryUpdateSchema = exports.countryCreateSchema = void 0;
const zod_1 = require("zod");
exports.countryCreateSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).max(100),
    code: zod_1.z.string().min(2).max(10),
    phoneCode: zod_1.z.string().optional(),
    iso3: zod_1.z.string().max(3).optional(),
});
exports.countryUpdateSchema = zod_1.z
    .object({
    name: zod_1.z.string().min(2).max(100).optional(),
    code: zod_1.z.string().min(2).max(10).optional(),
    phoneCode: zod_1.z.string().optional(),
    iso3: zod_1.z.string().max(3).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "No country fields provided",
});
//# sourceMappingURL=countrySchemas.js.map