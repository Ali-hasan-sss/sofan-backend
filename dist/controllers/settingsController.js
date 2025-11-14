"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SettingsController = void 0;
const systemSettingsService_1 = require("../services/systemSettingsService");
exports.SettingsController = {
    get: async (_req, res) => {
        const settings = await systemSettingsService_1.systemSettingsService.get();
        res.json(settings);
    },
    update: async (req, res) => {
        const settings = await systemSettingsService_1.systemSettingsService.update(req.body);
        res.json(settings);
    },
};
//# sourceMappingURL=settingsController.js.map