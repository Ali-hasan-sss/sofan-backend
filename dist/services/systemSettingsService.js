"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.systemSettingsService = void 0;
const SystemSettings_1 = require("../models/SystemSettings");
const settingsSchemas_1 = require("../validators/settingsSchemas");
const mapSettings = (doc) => ({
    id: doc.id,
    localCurrency: doc.localCurrency ?? null,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});
const ensureSettings = async () => {
    const existing = await SystemSettings_1.SystemSettingsModel.findOne();
    if (existing) {
        return existing;
    }
    return SystemSettings_1.SystemSettingsModel.create({});
};
exports.systemSettingsService = {
    get: async () => {
        const settings = await ensureSettings();
        return mapSettings(settings);
    },
    update: async (payload) => {
        const data = settingsSchemas_1.systemSettingsUpdateSchema.parse(payload);
        const settings = await ensureSettings();
        if (data.localCurrency !== undefined) {
            if (!data.localCurrency) {
                settings.localCurrency = null;
            }
            else {
                settings.localCurrency = data.localCurrency.toUpperCase();
            }
        }
        await settings.save();
        return mapSettings(settings);
    },
};
//# sourceMappingURL=systemSettingsService.js.map