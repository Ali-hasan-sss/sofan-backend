"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = void 0;
const Wallet_1 = require("../models/Wallet");
const mongoose_1 = require("mongoose");
exports.walletService = {
    getByUser: async (userId) => {
        const wallet = await Wallet_1.WalletModel.findOne({ user: userId }).lean();
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
    addCredit: async (userId, amount, currency, reference, meta) => {
        // Find or create wallet
        let wallet = await Wallet_1.WalletModel.findOne({ user: userId });
        if (!wallet) {
            wallet = await Wallet_1.WalletModel.create({
                user: new mongoose_1.Types.ObjectId(userId),
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
//# sourceMappingURL=walletService.js.map