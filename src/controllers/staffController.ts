import { Request, Response } from "express";
import { staffService } from "../services/staffService";

export const StaffController = {
  list: async (req: Request, res: Response) => {
    const staff = await staffService.list({
      branch: req.query.branch as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json(staff);
  },

  create: async (req: Request, res: Response) => {
    const staffMember = await staffService.create(req.body);
    res.status(201).json(staffMember);
  },

  update: async (req: Request, res: Response) => {
    const staffMember = await staffService.update(req.params.id, req.body);
    res.json(staffMember);
  },

  remove: async (req: Request, res: Response) => {
    const result = await staffService.remove(req.params.id);
    res.json(result);
  },
};
