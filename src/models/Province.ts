import { Schema, model, type Document } from "mongoose";

export interface ProvinceDocument extends Document {
  name: string;
  code?: string;
  country: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProvinceSchema = new Schema<ProvinceDocument>(
  {
    name: { type: String, required: true, trim: true, index: true },
    code: { type: String, trim: true },
    country: { type: String, required: true, trim: true, index: true },
  },
  { timestamps: true }
);

ProvinceSchema.index({ country: 1, name: 1 }, { unique: true });

export const ProvinceModel = model<ProvinceDocument>(
  "Province",
  ProvinceSchema
);
