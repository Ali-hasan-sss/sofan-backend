import { Request, Response } from "express";
import { countryService } from "../services/countryService";

export const CountryController = {
  list: async (_req: Request, res: Response) => {
    const countries = await countryService.list();
    res.json(countries);
  },

  create: async (req: Request, res: Response) => {
    const country = await countryService.create(req.body);
    res.status(201).json(country);
  },

  update: async (req: Request, res: Response) => {
    const country = await countryService.update(req.params.id, req.body);
    res.json(country);
  },

  remove: async (req: Request, res: Response) => {
    await countryService.remove(req.params.id);
    res.status(204).end();
  },
};
