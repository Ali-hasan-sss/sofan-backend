import { Request, Response } from "express";
import { shipmentService } from "../services/shipmentService";
import { ROLES } from "../types/roles";

export const ShipmentController = {
  list: async (req: Request, res: Response) => {
    // If user is USER_PERSONAL or USER_BUSINESS, only show their shipments
    const userRoles = req.user?.roles ?? [];
    const isRegularUser =
      userRoles.includes(ROLES.USER_PERSONAL) ||
      userRoles.includes(ROLES.USER_BUSINESS);

    const shipments = await shipmentService.list({
      country: req.user?.country,
      branch: req.query.branch as string | undefined,
      status: req.query.status as string | undefined,
      createdBy: isRegularUser ? req.user?.id : undefined,
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

    // If user is USER_PERSONAL or USER_BUSINESS, only allow access to their own shipments
    const userRoles = req.user?.roles ?? [];
    const isRegularUser =
      userRoles.includes(ROLES.USER_PERSONAL) ||
      userRoles.includes(ROLES.USER_BUSINESS);

    if (isRegularUser && (shipment as any).createdBy !== req.user?.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    res.json(shipment);
  },

  update: async (req: Request, res: Response) => {
    const shipment = await shipmentService.update({
      id: req.params.id,
      data: req.body,
      updatedBy: req.user?.id as string,
    });
    res.json(shipment);
  },

  remove: async (req: Request, res: Response) => {
    const result = await shipmentService.remove({
      id: req.params.id,
      requestedBy: req.user?.id as string,
    });
    res.json(result);
  },

  trackPublic: async (req: Request, res: Response) => {
    const shipment = await shipmentService.getByNumber(req.params.number);
    res.json(shipment);
  },
};
