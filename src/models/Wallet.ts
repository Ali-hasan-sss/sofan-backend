import { Schema, model, Document, Types } from "mongoose";

export type WalletTransactionType = "credit" | "debit" | "hold" | "release";

export interface WalletTransaction {
  type: WalletTransactionType;
  amount: number;
  currency: string;
  reference: string;
  meta?: Record<string, unknown>;
  createdAt: Date;
}

export interface WalletDocument extends Document {
  user: Types.ObjectId;
  balance: number;
  currency: string;
  transactions: WalletTransaction[];
  createdAt: Date;
  updatedAt: Date;
}

const WalletTransactionSchema = new Schema<WalletTransaction>(
  {
    type: {
      type: String,
      enum: ["credit", "debit", "hold", "release"],
      required: true,
    },
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
    reference: { type: String, required: true },
    meta: { type: Schema.Types.Mixed },
    createdAt: { type: Date, default: Date.now },
  },
  { _id: false }
);

const WalletSchema = new Schema<WalletDocument>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    balance: { type: Number, default: 0 },
    currency: { type: String, required: true },
    transactions: { type: [WalletTransactionSchema], default: [] },
  },
  { timestamps: true }
);

export const WalletModel = model<WalletDocument>("Wallet", WalletSchema);
