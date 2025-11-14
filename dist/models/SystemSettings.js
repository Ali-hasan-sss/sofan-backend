"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SystemSettingsModel = void 0;
const mongoose_1 = require("mongoose");
const SystemSettingsSchema = new mongoose_1.Schema({
    localCurrency: {
        type: String,
        trim: true,
        uppercase: true,
        default: null,
    },
}, { timestamps: true });
exports.SystemSettingsModel = (0, mongoose_1.model)("SystemSettings", SystemSettingsSchema);
//# sourceMappingURL=SystemSettings.js.map