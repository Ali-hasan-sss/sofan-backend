import { Schema, model, Document } from "mongoose";

export interface UserShippingCodeCounterDocument extends Document {
  country: string;
  seq: number;
  updatedAt: Date;
}

const UserShippingCodeCounterSchema =
  new Schema<UserShippingCodeCounterDocument>(
    {
      country: { type: String, required: true, unique: true },
      seq: { type: Number, default: 0 },
    },
    { timestamps: true }
  );

export const UserShippingCodeCounterModel =
  model<UserShippingCodeCounterDocument>(
    "UserShippingCodeCounter",
    UserShippingCodeCounterSchema
  );
