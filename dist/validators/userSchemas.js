"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.adminUpdateUserSchema = exports.adminCreateUserSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../types/roles");
const roleValues = Object.values(roles_1.ROLES);
const adminEmailSchema = zod_1.z
    .string()
    .email()
    .transform((value) => value.trim().toLowerCase());
exports.adminCreateUserSchema = zod_1.z.object({
    email: adminEmailSchema,
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(roleValues),
    country: zod_1.z.string().min(2).optional(),
    password: zod_1.z.string().min(8),
});
exports.adminUpdateUserSchema = zod_1.z
    .object({
    email: adminEmailSchema.optional(),
    firstName: zod_1.z.string().min(1).optional(),
    lastName: zod_1.z.string().min(1).optional(),
    role: zod_1.z.enum(roleValues).optional(),
    country: zod_1.z.string().min(2).optional(),
    password: zod_1.z.string().min(8).optional(),
})
    .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field must be provided",
});
//# sourceMappingURL=userSchemas.js.map