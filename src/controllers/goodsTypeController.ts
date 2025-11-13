import { Request, Response } from "express";
import { goodsTypeService } from "../services/goodsTypeService";

export const GoodsTypeController = {
  list: async (_req: Request, res: Response) => {
    const goodsTypes = await goodsTypeService.list();
    res.json(goodsTypes);
  },

  listPublic: async (_req: Request, res: Response) => {
    const goodsTypes = await goodsTypeService.listActive();
    res.json(goodsTypes);
  },

  create: async (req: Request, res: Response) => {
    const goodsType = await goodsTypeService.create(req.body);
    res.status(201).json(goodsType);
  },

  update: async (req: Request, res: Response) => {
    const goodsType = await goodsTypeService.update(req.params.id, req.body);
    res.json(goodsType);
  },

  remove: async (req: Request, res: Response) => {
    const result = await goodsTypeService.remove(req.params.id);
    res.json(result);
  },
};
