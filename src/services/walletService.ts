import { WalletModel } from "../models/Wallet";
import { Types } from "mongoose";

export const walletService = {
  getByUser: async (userId: string) => {
    const wallet = await WalletModel.findOne({ user: userId }).lean();
    if (!wallet) {
      return { balance: 0, currency: "USD", transactions: [] };
    }

    return {
      id: String(wallet._id),
      balance: wallet.balance,
      currency: wallet.currency,
      transactions: wallet.transactions,
    };
  },

  addCredit: async (
    userId: string,
    amount: number,
    currency: string,
    reference: string,
    meta?: Record<string, unknown>
  ) => {
    // Find or create wallet
    let wallet = await WalletModel.findOne({ user: userId });
    if (!wallet) {
      wallet = await WalletModel.create({
        user: new Types.ObjectId(userId),
        balance: 0,
        currency: currency,
        transactions: [],
      });
    }

    // Ensure currency matches
    if (wallet.currency !== currency) {
      // If currency mismatch, we might need to convert or handle differently
      // For now, we'll just use the wallet's currency
      currency = wallet.currency;
    }

    // Add transaction
    wallet.transactions.push({
      type: "credit",
      amount: amount,
      currency: currency,
      reference: reference,
      meta: meta,
      createdAt: new Date(),
    });

    // Update balance
    wallet.balance = (wallet.balance || 0) + amount;

    await wallet.save();

    return {
      id: String(wallet._id),
      balance: wallet.balance,
      currency: wallet.currency,
    };
  },
};
