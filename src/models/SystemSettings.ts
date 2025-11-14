import { Schema, model, type Document } from "mongoose";

export interface SystemSettingsDocument extends Document {
  localCurrency?: string | null;
  createdAt: Date;
  updatedAt: Date;
}

const SystemSettingsSchema = new Schema<SystemSettingsDocument>(
  {
    localCurrency: {
      type: String,
      trim: true,
      uppercase: true,
      default: null,
    },
  },
  { timestamps: true }
);

export const SystemSettingsModel = model<SystemSettingsDocument>(
  "SystemSettings",
  SystemSettingsSchema
);
