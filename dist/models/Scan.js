"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ScanModel = void 0;
const mongoose_1 = require("mongoose");
const ScanSchema = new mongoose_1.Schema({
    shipment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shipment",
        required: true,
        index: true,
    },
    scanType: {
        type: String,
        enum: [
            "pickup",
            "arrival_at_branch",
            "departure_from_branch",
            "delivery",
        ],
        required: true,
    },
    scannedBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch", index: true },
    courier: { type: mongoose_1.Schema.Types.ObjectId, ref: "Courier" },
    location: {
        latitude: { type: Number },
        longitude: { type: Number },
        address: { type: String },
    },
    notes: { type: String },
}, { timestamps: { createdAt: true, updatedAt: false } });
ScanSchema.index({ shipment: 1, createdAt: -1 });
ScanSchema.index({ branch: 1, createdAt: -1 });
ScanSchema.index({ scannedBy: 1, createdAt: -1 });
exports.ScanModel = (0, mongoose_1.model)("Scan", ScanSchema);
//# sourceMappingURL=Scan.js.map