import { Schema, model, type Document } from "mongoose";

export interface GoodsTypeDocument extends Document {
  name: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const GoodsTypeSchema = new Schema<GoodsTypeDocument>(
  {
    name: { type: String, required: true, unique: true, trim: true },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const GoodsTypeModel = model<GoodsTypeDocument>(
  "GoodsType",
  GoodsTypeSchema
);
