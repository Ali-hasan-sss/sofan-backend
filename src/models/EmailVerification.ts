import { Schema, model, type Document } from "mongoose";

export interface EmailVerificationDocument extends Document {
  email: string;
  code: string;
  expiresAt: Date;
  verifiedAt?: Date | null;
  verificationToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EmailVerificationSchema = new Schema<EmailVerificationDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    verificationToken: { type: String },
  },
  {
    timestamps: true,
  }
);

EmailVerificationSchema.index({ email: 1 }, { unique: true });
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

export const EmailVerificationModel = model<EmailVerificationDocument>(
  "EmailVerification",
  EmailVerificationSchema
);
