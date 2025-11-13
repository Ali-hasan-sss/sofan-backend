"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VolumeRateModel = void 0;
const mongoose_1 = require("mongoose");
const VolumeRateSchema = new mongoose_1.Schema({
    originBranch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    destinationBranch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    localCurrency: { type: String, required: true, trim: true },
    pricePerCubicMeterLocal: { type: Number, required: true },
    pricePerCubicMeterUsd: { type: Number, required: true },
    pickupDoorFeeLocal: { type: Number, default: 0 },
    pickupDoorFeeUsd: { type: Number, default: 0 },
    deliveryDoorFeeLocal: { type: Number, default: 0 },
    deliveryDoorFeeUsd: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
VolumeRateSchema.index({ originBranch: 1, destinationBranch: 1 }, { unique: true });
exports.VolumeRateModel = (0, mongoose_1.model)("VolumeRate", VolumeRateSchema);
//# sourceMappingURL=VolumeRate.js.map