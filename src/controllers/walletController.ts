import { Request, Response } from "express";
import { walletService } from "../services/walletService";

export const WalletController = {
  getMyWallet: async (req: Request, res: Response) => {
    const wallet = await walletService.getByUser(req.user?.id as string);
    res.json(wallet);
  },

  getByUser: async (req: Request, res: Response) => {
    const wallet = await walletService.getByUser(req.params.userId);
    res.json(wallet);
  },
};
