"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WalletController = void 0;
const walletService_1 = require("../services/walletService");
exports.WalletController = {
    getMyWallet: async (req, res) => {
        const wallet = await walletService_1.walletService.getByUser(req.user?.id);
        res.json(wallet);
    },
    getByUser: async (req, res) => {
        const wallet = await walletService_1.walletService.getByUser(req.params.userId);
        res.json(wallet);
    },
};
//# sourceMappingURL=walletController.js.map