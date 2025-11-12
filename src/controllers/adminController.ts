import { Request, Response } from "express";
import { adminService } from "../services/adminService";

export const AdminController = {
  overview: async (_req: Request, res: Response) => {
    const data = await adminService.getOverview();
    res.json(data);
  },
};
