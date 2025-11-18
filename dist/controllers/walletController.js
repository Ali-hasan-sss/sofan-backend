"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const walletService_1 = require("../services/walletService");
exports.WalletController = {
    getMyWallet: async (req, res) => {
        const wallet = await walletService_1.walletService.getByUser(req.user?.id);
        // Convert to both currencies
        let balance = { local: 0, usd: 0 };
        if (wallet.balance !== undefined) {
            if (wallet.currency === "USD") {
                balance.usd = wallet.balance;
                balance.local = wallet.balance * 3.75; // Example conversion rate
            }
            else {
                balance.local = wallet.balance;
                balance.usd = wallet.balance / 3.75; // Example conversion rate
            }
        }
        // Format transactions
        const transactions = (wallet.transactions || []).map((tx) => ({
            id: tx._id?.toString() || Math.random().toString(36).substr(2, 9),
            type: tx.type,
            amount: tx.amount,
            currency: tx.currency,
            description: tx.reference || `${tx.type} transaction`,
            createdAt: tx.createdAt || new Date(),
            meta: tx.meta || {},
        }));
        res.json({
            balance,
            localCurrency: wallet.currency === "USD" ? "SAR" : wallet.currency,
            transactions,
        });
    },
    getByUser: async (req, res) => {
        const wallet = await walletService_1.walletService.getByUser(req.params.userId);
        res.json(wallet);
    },
};
//# sourceMappingURL=walletController.js.map