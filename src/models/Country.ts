import { Schema, model, Document } from "mongoose";

export interface CountryDocument extends Document {
  name: string;
  code: string;
  phoneCode?: string;
  iso3?: string;
  createdAt: Date;
  updatedAt: Date;
}

const CountrySchema = new Schema<CountryDocument>(
  {
    name: { type: String, required: true, trim: true, unique: true },
    code: {
      type: String,
      required: true,
      trim: true,
      uppercase: true,
      unique: true,
    },
    phoneCode: { type: String, trim: true },
    iso3: { type: String, trim: true, uppercase: true },
  },
  { timestamps: true }
);

export const CountryModel = model<CountryDocument>("Country", CountrySchema);
