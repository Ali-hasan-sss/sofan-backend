import { WalletModel } from "../models/Wallet";

export const walletService = {
  getByUser: async (userId: string) => {
    const wallet = await WalletModel.findOne({ user: userId }).lean();
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
