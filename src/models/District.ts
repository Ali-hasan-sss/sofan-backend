import { Schema, model, type Document, type Types } from "mongoose";

export interface DistrictDocument extends Document {
  name: string;
  code?: string;
  province: Types.ObjectId;
  branch?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const DistrictSchema = new Schema<DistrictDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    province: {
      type: Schema.Types.ObjectId,
      ref: "Province",
      required: true,
      index: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true }
);

DistrictSchema.index({ province: 1, name: 1 }, { unique: true });

export const DistrictModel = model<DistrictDocument>(
  "District",
  DistrictSchema
);
