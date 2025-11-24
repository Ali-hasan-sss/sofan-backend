import { Schema, model, Document, Types } from "mongoose";

export type ScanType =
  | "pickup" // مسح عند الاستلام من المرسل
  | "arrival_at_branch" // مسح عند وصول الطرد للفرع
  | "departure_from_branch" // مسح عند خروج الطرد من الفرع
  | "delivery"; // مسح عند التسليم للمستلم

export interface ScanDocument extends Document {
  shipment: Types.ObjectId;
  scanType: ScanType;
  scannedBy: Types.ObjectId; // User or Courier who scanned
  branch?: Types.ObjectId; // Branch where scan occurred
  courier?: Types.ObjectId; // Courier who scanned (if applicable)
  location?: {
    latitude?: number;
    longitude?: number;
    address?: string;
  };
  notes?: string;
  createdAt: Date;
}

const ScanSchema = new Schema<ScanDocument>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
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
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    courier: { type: Schema.Types.ObjectId, ref: "Courier" },
    location: {
      latitude: { type: Number },
      longitude: { type: Number },
      address: { type: String },
    },
    notes: { type: String },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ScanSchema.index({ shipment: 1, createdAt: -1 });
ScanSchema.index({ branch: 1, createdAt: -1 });
ScanSchema.index({ scannedBy: 1, createdAt: -1 });

export const ScanModel = model<ScanDocument>("Scan", ScanSchema);
