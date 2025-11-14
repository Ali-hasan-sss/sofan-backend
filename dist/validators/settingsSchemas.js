"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSettingsUpdateSchema = void 0;
const zod_1 = require("zod");
const currencyCodeSchema = zod_1.z
    .string()
    .trim()
    .min(3, "Currency code must be at least 3 characters")
    .max(6, "Currency code must be at most 6 characters")
    .regex(/^[A-Za-z]+$/, "Currency code must contain only letters")
    .transform((value) => value.toUpperCase());
exports.systemSettingsUpdateSchema = zod_1.z.object({
    localCurrency: zod_1.z
        .union([currencyCodeSchema, zod_1.z.literal(""), zod_1.z.null()])
        .optional()
        .transform((value) => {
        if (value === "" || value === null || value === undefined) {
            return null;
        }
        return value;
    }),
});
//# sourceMappingURL=settingsSchemas.js.map