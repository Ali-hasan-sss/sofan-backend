import { Schema, model, Document } from "mongoose";

export interface BranchDocument extends Document {
  name: string;
  country: string;
  code: string;
  address: string;
  contactNumber?: string;
  isActive: boolean;
  manager?: Schema.Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const BranchSchema = new Schema<BranchDocument>(
  {
    name: { type: String, required: true },
    country: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    isActive: { type: Boolean, default: true },
    manager: { type: Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

export const BranchModel = model<BranchDocument>("Branch", BranchSchema);
