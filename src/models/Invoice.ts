import { Schema, model, Document, Types } from "mongoose";

export interface InvoiceLineItem {
  shipment: Types.ObjectId;
  description: string;
  amount: number;
  currency: string;
}

export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue";

export interface InvoiceDocument extends Document {
  invoiceNumber: string;
  user: Types.ObjectId;
  branch?: Types.ObjectId;
  country: string;
  lineItems: InvoiceLineItem[];
  totalAmount: number;
  currency: string;
  status: InvoiceStatus;
  issuedAt?: Date;
  dueAt?: Date;
  pdfUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

const InvoiceLineItemSchema = new Schema<InvoiceLineItem>(
  {
    shipment: { type: Schema.Types.ObjectId, ref: "Shipment", required: true },
    description: { type: String, required: true },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const InvoiceSchema = new Schema<InvoiceDocument>(
  {
    invoiceNumber: { type: String, required: true, unique: true },
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
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
  },
  { timestamps: true }
);

InvoiceSchema.index({ user: 1, createdAt: -1 });

export const InvoiceModel = model<InvoiceDocument>("Invoice", InvoiceSchema);
