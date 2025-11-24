"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentTrackingModel = void 0;
const mongoose_1 = require("mongoose");
const ShipmentTrackingSchema = new mongoose_1.Schema({
    shipment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shipment",
        required: true,
        index: true,
    },
    eventType: {
        type: String,
        enum: [
            "created",
            "approved",
            "courier_assigned",
            "task_created",
            "picked_up",
            "arrived_at_branch",
            "departed_from_branch",
            "in_transit",
            "out_for_delivery",
            "delivered",
            "cancelled",
            "scan",
        ],
        required: true,
    },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    courier: { type: mongoose_1.Schema.Types.ObjectId, ref: "Courier" },
    scannedBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    metadata: { type: mongoose_1.Schema.Types.Mixed },
}, { timestamps: { createdAt: true, updatedAt: false } });
ShipmentTrackingSchema.index({ shipment: 1, createdAt: -1 });
ShipmentTrackingSchema.index({ branch: 1, createdAt: -1 });
ShipmentTrackingSchema.index({ courier: 1, createdAt: -1 });
exports.ShipmentTrackingModel = (0, mongoose_1.model)("ShipmentTracking", ShipmentTrackingSchema);
//# sourceMappingURL=ShipmentTracking.js.map