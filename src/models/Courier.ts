import { Schema, model, Document, Types } from "mongoose";

export interface CourierDocument extends Document {
  firstName: string;
  lastName: string;
  phone: string;
  email?: string;
  branch: Types.ObjectId;
  isActive: boolean;
  vehicleType?: string; // "motorcycle", "car", "truck", etc.
  licenseNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CourierSchema = new Schema<CourierDocument>(
  {
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    branch: {
      type: Schema.Types.ObjectId,
      ref: "Branch",
      required: true,
      index: true,
    },
    isActive: { type: Boolean, default: true },
    vehicleType: { type: String },
    licenseNumber: { type: String },
  },
  { timestamps: true }
);

CourierSchema.index({ branch: 1, isActive: 1 });

export const CourierModel = model<CourierDocument>("Courier", CourierSchema);
