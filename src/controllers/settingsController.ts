import { Request, Response } from "express";
import { systemSettingsService } from "../services/systemSettingsService";

export const SettingsController = {
  get: async (_req: Request, res: Response) => {
    const settings = await systemSettingsService.get();
    res.json(settings);
  },

  update: async (req: Request, res: Response) => {
    const settings = await systemSettingsService.update(req.body);
    res.json(settings);
  },
};
