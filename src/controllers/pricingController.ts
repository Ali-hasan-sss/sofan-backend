import { Request, Response } from "express";
import { pricingService } from "../services/pricingService";

export const PricingController = {
  calculate: async (req: Request, res: Response) => {
    const pricing = await pricingService.calculate({ payload: req.body });
    res.json(pricing);
  },

  listRates: async (_req: Request, res: Response) => {
    const rates = await pricingService.listRates();
    res.json(rates);
  },

  createRate: async (req: Request, res: Response) => {
    const rate = await pricingService.createRate(req.body);
    res.status(201).json(rate);
  },

  updateRate: async (req: Request, res: Response) => {
    const rate = await pricingService.updateRate(req.params.id, req.body);
    res.json(rate);
  },

  removeRate: async (req: Request, res: Response) => {
    const result = await pricingService.removeRate(req.params.id);
    res.json(result);
  },
};
