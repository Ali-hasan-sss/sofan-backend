"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentTaskModel = void 0;
const mongoose_1 = require("mongoose");
const ShipmentTaskSchema = new mongoose_1.Schema({
    shipment: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Shipment",
        required: true,
        index: true,
    },
    taskType: {
        type: String,
        enum: ["pickup", "transfer", "delivery"],
        required: true,
    },
    employee: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        index: true,
    },
    courier: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Courier",
        required: false,
        index: true,
    },
    createdBy: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    branchFrom: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    branchTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    notes: { type: String },
    status: {
        type: String,
        enum: ["pending", "in_progress", "completed", "cancelled"],
        default: "pending",
        index: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
}, { timestamps: true });
ShipmentTaskSchema.index({ shipment: 1, taskType: 1, status: 1 });
ShipmentTaskSchema.index({ branchTo: 1, status: 1 });
exports.ShipmentTaskModel = (0, mongoose_1.model)("ShipmentTask", ShipmentTaskSchema);
//# sourceMappingURL=ShipmentTask.js.map