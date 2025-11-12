"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.walletService = void 0;
const Wallet_1 = require("../models/Wallet");
exports.walletService = {
    getByUser: async (userId) => {
        const wallet = await Wallet_1.WalletModel.findOne({ user: userId }).lean();
        if (!wallet) {
            return { balance: 0, currency: "USD", transactions: [] };
        }
        return {
            id: wallet._id.toString(),
            balance: wallet.balance,
            currency: wallet.currency,
            transactions: wallet.transactions,
        };
    },
};
//# sourceMappingURL=walletService.js.map