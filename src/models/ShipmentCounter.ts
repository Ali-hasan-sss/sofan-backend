import { Schema, model, Document } from "mongoose";

export interface ShipmentCounterDocument extends Document {
  country: string;
  seq: number;
  updatedAt: Date;
}

const ShipmentCounterSchema = new Schema<ShipmentCounterDocument>(
  {
    country: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export const ShipmentCounterModel = model<ShipmentCounterDocument>(
  "ShipmentCounter",
  ShipmentCounterSchema
);
