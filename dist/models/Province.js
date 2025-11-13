"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProvinceModel = void 0;
const mongoose_1 = require("mongoose");
const ProvinceSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, index: true },
    code: { type: String, trim: true },
    country: { type: String, required: true, trim: true, index: true },
}, { timestamps: true });
ProvinceSchema.index({ country: 1, name: 1 }, { unique: true });
exports.ProvinceModel = (0, mongoose_1.model)("Province", ProvinceSchema);
//# sourceMappingURL=Province.js.map