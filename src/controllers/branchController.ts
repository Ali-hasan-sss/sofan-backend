import { Request, Response } from "express";
import { branchService } from "../services/branchService";

export const BranchController = {
  list: async (req: Request, res: Response) => {
    const roles = req.user?.roles ?? [];
    const isSuperAdmin = roles.includes("SUPER_ADMIN");
    const filterCountry = isSuperAdmin ? undefined : req.user?.country;
    const branches = await branchService.list(filterCountry);
    res.json(branches);
  },

  create: async (req: Request, res: Response) => {
    const branch = await branchService.create(req.body);
    res.status(201).json(branch);
  },

  update: async (req: Request, res: Response) => {
    const branch = await branchService.update(req.params.id, req.body);
    res.json(branch);
  },

  remove: async (req: Request, res: Response) => {
    const result = await branchService.remove(req.params.id);
    res.json(result);
  },
};
