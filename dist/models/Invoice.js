"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceModel = void 0;
const mongoose_1 = require("mongoose");
const InvoiceLineItemSchema = new mongoose_1.Schema({
    shipment: { type: mongoose_1.Schema.Types.ObjectId, ref: "Shipment", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
}, { _id: false });
const InvoiceSchema = new mongoose_1.Schema({
    invoiceNumber: { type: String, required: true, unique: true },
    user: { type: mongoose_1.Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    country: { type: String, required: true },
    lineItems: { type: [InvoiceLineItemSchema], default: [] },
    totalAmount: { type: Number, required: true },
    currency: { type: String, required: true },
    status: {
        type: String,
        enum: ["draft", "issued", "paid", "overdue"],
        default: "draft",
    },
    issuedAt: { type: Date },
    dueAt: { type: Date },
    pdfUrl: { type: String },
}, { timestamps: true });
InvoiceSchema.index({ user: 1, createdAt: -1 });
exports.InvoiceModel = (0, mongoose_1.model)("Invoice", InvoiceSchema);
//# sourceMappingURL=Invoice.js.map