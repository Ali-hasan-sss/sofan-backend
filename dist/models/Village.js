"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VillageModel = void 0;
const mongoose_1 = require("mongoose");
const VillageSchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    district: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "District",
        required: true,
        index: true,
    },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
}, { timestamps: true });
VillageSchema.index({ district: 1, name: 1 }, { unique: true });
exports.VillageModel = (0, mongoose_1.model)("Village", VillageSchema);
//# sourceMappingURL=Village.js.map