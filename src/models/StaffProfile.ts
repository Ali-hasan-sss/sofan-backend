import { Schema, model, type Document, type Types } from "mongoose";

export interface StaffProfileDocument extends Document {
  user: Types.ObjectId;
  jobTitle?: string;
  permissions: string[];
  branch?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const StaffProfileSchema = new Schema<StaffProfileDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
      index: true,
    },
    jobTitle: { type: String, trim: true },
    permissions: { type: [String], default: [] },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export const StaffProfileModel = model<StaffProfileDocument>(
  "StaffProfile",
  StaffProfileSchema
);
