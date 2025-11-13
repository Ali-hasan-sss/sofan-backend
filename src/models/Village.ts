import { Schema, model, type Document, type Types } from "mongoose";

export interface VillageDocument extends Document {
  name: string;
  code?: string;
  district: Types.ObjectId;
  branch?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const VillageSchema = new Schema<VillageDocument>(
  {
    name: { type: String, required: true, trim: true },
    code: { type: String, trim: true },
    district: {
      type: Schema.Types.ObjectId,
      ref: "District",
      required: true,
      index: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
  },
  { timestamps: true }
);

VillageSchema.index({ district: 1, name: 1 }, { unique: true });

export const VillageModel = model<VillageDocument>("Village", VillageSchema);
