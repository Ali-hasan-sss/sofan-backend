import { Document, Types } from "mongoose";
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
export declare const WalletModel: import("mongoose").Model<WalletDocument, {}, {}, {}, Document<unknown, {}, WalletDocument, {}, {}> & WalletDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Wallet.d.ts.map