"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentModel = void 0;
const mongoose_1 = require("mongoose");
const AddressSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
}, { _id: false });
const PackageSchema = new mongoose_1.Schema({
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    declaredValue: {
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
    },
    goodsType: { type: String, required: true },
    volumetricWeight: { type: Number, required: true },
}, { _id: false });
const PricingBreakdownSchema = new mongoose_1.Schema({
    baseRate: { type: Number, required: true },
    weightCharge: { type: Number, required: true },
    volumetricWeight: { type: Number, required: true },
    pickupFee: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    codFee: { type: Number, required: true },
    insuranceFee: { type: Number, required: true },
    currency: { type: String, required: true },
    total: { type: Number, required: true },
}, { _id: false });
const ShipmentSchema = new mongoose_1.Schema({
    shipmentNumber: { type: String, required: true, unique: true },
    country: { type: String, required: true, index: true },
    type: {
        type: String,
        enum: [
            "door_to_door",
            "branch_to_branch",
            "branch_to_door",
            "door_to_branch",
        ],
        required: true,
    },
    branchFrom: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    branchTo: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    createdBy: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: AddressSchema, required: true },
    recipient: { type: AddressSchema, required: true },
    packages: { type: [PackageSchema], required: true },
    pricing: { type: PricingBreakdownSchema, required: true },
    codAmount: { type: Number },
    codCurrency: { type: String },
    walletTransaction: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    status: {
        type: String,
        enum: [
            "draft",
            "pending_approval",
            "awaiting_pickup",
            "in_transit",
            "delivered",
            "cancelled",
        ],
        default: "pending_approval",
    },
    approvals: {
        type: [
            {
                approvedBy: {
                    type: mongoose_1.Schema.Types.ObjectId,
                    ref: "User",
                    required: true,
                },
                approvedAt: { type: Date, required: true },
            },
        ],
        default: [],
    },
}, { timestamps: true });
ShipmentSchema.index({ country: 1, createdAt: -1 });
exports.ShipmentModel = (0, mongoose_1.model)("Shipment", ShipmentSchema);
//# sourceMappingURL=Shipment.js.map