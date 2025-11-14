"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoodsTypeModel = void 0;
const mongoose_1 = require("mongoose");
const GoodsTypeSchema = new mongoose_1.Schema({
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
GoodsTypeSchema.index({ name: 1 }, { unique: true });
exports.GoodsTypeModel = (0, mongoose_1.model)("GoodsType", GoodsTypeSchema);
//# sourceMappingURL=GoodsType.js.map