import { Request, Response } from "express";
import { pricingService } from "../services/pricingService";

export const PricingController = {
  calculate: async (req: Request, res: Response) => {
    const pricing = await pricingService.calculate({
      payload: req.body,
      country: req.user?.country as string,
    });
    res.json(pricing);
  },

  listRules: async (req: Request, res: Response) => {
    const rules = await pricingService.listRules(req.user?.country);
    res.json(rules);
  },

  createRule: async (req: Request, res: Response) => {
    const rule = await pricingService.createRule(req.body);
    res.status(201).json(rule);
  },
};
