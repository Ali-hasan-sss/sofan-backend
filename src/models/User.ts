import { Schema, model, Document, Types } from "mongoose";
import { Role } from "../types/roles";

export type UserStatus = "pending" | "approved" | "rejected";

export interface UserDocument extends Document {
  email: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  phone?: string;
  role: Role;
  locale: "ar" | "en";
  country: string;
  shippingCode?: string;
  branch?: Types.ObjectId;
  status: UserStatus;
  businessName?: string;
  wallet?: Types.ObjectId;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    role: {
      type: String,
      required: true,
      enum: [
        "SUPER_ADMIN",
        "BRANCH_ADMIN",
        "EMPLOYEE",
        "USER_PERSONAL",
        "USER_BUSINESS",
      ],
    },
    locale: { type: String, enum: ["ar", "en"], default: "en" },
    country: { type: String, required: true },
    shippingCode: {
      type: String,
      unique: true,
      sparse: true,
      uppercase: true,
      trim: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    businessName: { type: String },
    wallet: { type: Schema.Types.ObjectId, ref: "Wallet" },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

UserSchema.index({ country: 1, branch: 1 });
UserSchema.index({ shippingCode: 1 });

export const UserModel = model<UserDocument>("User", UserSchema);
