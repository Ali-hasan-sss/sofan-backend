"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyCodeSchema = exports.sendVerificationCodeSchema = exports.checkEmailSchema = exports.refreshSchema = exports.loginSchema = exports.registerSchema = void 0;
const zod_1 = require("zod");
const roles_1 = require("../types/roles");
const userRoles = [roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS];
const emailSchema = zod_1.z
    .string()
    .email()
    .transform((value) => value.trim().toLowerCase());
exports.registerSchema = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string().min(8),
    firstName: zod_1.z.string().min(1),
    lastName: zod_1.z.string().min(1),
    role: zod_1.z.enum(userRoles),
    verificationToken: zod_1.z.string().min(10),
    locale: zod_1.z.enum(["ar", "en"]).default("ar"),
    country: zod_1.z.string().min(2).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: emailSchema,
    password: zod_1.z.string().min(1),
});
exports.refreshSchema = zod_1.z.object({
    refreshToken: zod_1.z.string().min(10),
});
exports.checkEmailSchema = zod_1.z.object({
    email: emailSchema,
});
exports.sendVerificationCodeSchema = exports.checkEmailSchema;
exports.verifyCodeSchema = exports.checkEmailSchema.extend({
    code: zod_1.z.string().min(4).max(6),
});
//# sourceMappingURL=authSchemas.js.map