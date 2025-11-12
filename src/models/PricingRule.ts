import { Schema, model, Document, Types } from "mongoose";
import { Money } from "../types";

export interface WeightRange {
  min: number;
  max: number;
  ratePerKg: number;
}

export interface PricingRuleDocument extends Document {
  country: string;
  branch?: Types.ObjectId;
  currency: string;
  volumetricDivisor: number;
  pickupFee: number;
  deliveryFee: number;
  codFeePercent: number;
  codFeeFlat: number;
  insuranceRatePercent: number;
  weightRanges: WeightRange[];
  baseRate: number;
  createdAt: Date;
  updatedAt: Date;
}

const WeightRangeSchema = new Schema<WeightRange>(
  {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    ratePerKg: { type: Number, required: true },
  },
  { _id: false }
);

const PricingRuleSchema = new Schema<PricingRuleDocument>(
  {
    country: { type: String, required: true, index: true },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    currency: { type: String, required: true },
    volumetricDivisor: { type: Number, required: true },
    pickupFee: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    codFeePercent: { type: Number, default: 0 },
    codFeeFlat: { type: Number, default: 0 },
    insuranceRatePercent: { type: Number, default: 0 },
    weightRanges: { type: [WeightRangeSchema], default: [] },
    baseRate: { type: Number, default: 0 },
  },
  { timestamps: true }
);

PricingRuleSchema.index({ country: 1, branch: 1 }, { unique: false });

export const PricingRuleModel = model<PricingRuleDocument>(
  "PricingRule",
  PricingRuleSchema
);
