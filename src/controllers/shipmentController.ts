import { Request, Response } from "express";
import { shipmentService } from "../services/shipmentService";

export const ShipmentController = {
  list: async (req: Request, res: Response) => {
    const shipments = await shipmentService.list({
      country: req.user?.country,
      branch: req.query.branch as string | undefined,
      status: req.query.status as string | undefined,
    });
    res.json(shipments);
  },

  create: async (req: Request, res: Response) => {
    const shipment = await shipmentService.create({
      data: req.body,
      createdBy: req.user?.id as string,
      country: req.user?.country as string,
    });
    res.status(201).json(shipment);
  },

  getById: async (req: Request, res: Response) => {
    const shipment = await shipmentService.getById(req.params.id);
    res.json(shipment);
  },

  trackPublic: async (req: Request, res: Response) => {
    const shipment = await shipmentService.getByNumber(req.params.number);
    res.json(shipment);
  },
};
