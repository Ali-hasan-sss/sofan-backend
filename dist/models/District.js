"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DistrictModel = void 0;
const mongoose_1 = require("mongoose");
const DistrictSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    province: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Province",
        required: true,
        index: true,
    },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
}, { timestamps: true });
DistrictSchema.index({ province: 1, name: 1 }, { unique: true });
exports.DistrictModel = (0, mongoose_1.model)("District", DistrictSchema);
//# sourceMappingURL=District.js.map