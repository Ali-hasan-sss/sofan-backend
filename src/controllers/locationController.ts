import { Request, Response } from "express";
import { locationService } from "../services/locationService";

export const LocationController = {
  hierarchy: async (_req: Request, res: Response) => {
    const tree = await locationService.listHierarchy();
    res.json(tree);
  },

  createProvince: async (req: Request, res: Response) => {
    const province = await locationService.createProvince(req.body);
    res.status(201).json(province);
  },

  updateProvince: async (req: Request, res: Response) => {
    const province = await locationService.updateProvince(
      req.params.id,
      req.body
    );
    res.json(province);
  },

  deleteProvince: async (req: Request, res: Response) => {
    const result = await locationService.deleteProvince(req.params.id);
    res.json(result);
  },

  createDistrict: async (req: Request, res: Response) => {
    const district = await locationService.createDistrict(req.body);
    res.status(201).json(district);
  },

  updateDistrict: async (req: Request, res: Response) => {
    const district = await locationService.updateDistrict(
      req.params.id,
      req.body
    );
    res.json(district);
  },

  deleteDistrict: async (req: Request, res: Response) => {
    const result = await locationService.deleteDistrict(req.params.id);
    res.json(result);
  },

  createVillage: async (req: Request, res: Response) => {
    const village = await locationService.createVillage(req.body);
    res.status(201).json(village);
  },

  updateVillage: async (req: Request, res: Response) => {
    const village = await locationService.updateVillage(
      req.params.id,
      req.body
    );
    res.json(village);
  },

  deleteVillage: async (req: Request, res: Response) => {
    const result = await locationService.deleteVillage(req.params.id);
    res.json(result);
  },
};
