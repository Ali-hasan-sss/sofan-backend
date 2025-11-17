import { Request, Response } from "express";
import { userService } from "../services/userService";

export const UserController = {
  list: async (req: Request, res: Response) => {
    const users = await userService.list({
      status: req.query.status as string | undefined,
      role: req.query.role as string | undefined,
      search: req.query.search as string | undefined,
    });
    res.json(users);
  },

  listStaff: async (_req: Request, res: Response) => {
    const staff = await userService.listStaff();
    res.json(staff);
  },

  create: async (req: Request, res: Response) => {
    const result = await userService.createByAdmin(req.body);
    res.status(201).json(result);
  },

  listPending: async (req: Request, res: Response) => {
    const users = await userService.listPending(req.user?.country);
    res.json(users);
  },

  approve: async (req: Request, res: Response) => {
    const result = await userService.updateStatus(
      req.params.id,
      "approved",
      req.user?.id
    );
    res.json(result);
  },

  reject: async (req: Request, res: Response) => {
    const result = await userService.updateStatus(
      req.params.id,
      "rejected",
      req.user?.id
    );
    res.json(result);
  },

  disable: async (req: Request, res: Response) => {
    const result = await userService.setActiveState(req.params.id, false);
    res.json(result);
  },

  activate: async (req: Request, res: Response) => {
    const result = await userService.setActiveState(req.params.id, true);
    res.json(result);
  },

  update: async (req: Request, res: Response) => {
    const result = await userService.update(req.params.id, req.body);
    res.json(result);
  },

  remove: async (req: Request, res: Response) => {
    const result = await userService.deleteUser(req.params.id);
    res.json(result);
  },
};
