import { Schema, model, type Document, type Types } from "mongoose";

export interface VolumeRateDocument extends Document {
  originBranch: Types.ObjectId;
  destinationBranch: Types.ObjectId;
  localCurrency: string;
  pricePerCubicMeterLocal: number;
  pricePerCubicMeterUsd: number;
  pickupDoorFeeLocal: number;
  pickupDoorFeeUsd: number;
  deliveryDoorFeeLocal: number;
  deliveryDoorFeeUsd: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const VolumeRateSchema = new Schema<VolumeRateDocument>(
  {
    originBranch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    destinationBranch: {
      type: Schema.Types.ObjectId,
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
  },
  { timestamps: true }
);

VolumeRateSchema.index(
  { originBranch: 1, destinationBranch: 1 },
  { unique: true }
);

export const VolumeRateModel = model<VolumeRateDocument>(
  "VolumeRate",
  VolumeRateSchema
);
