import { Request, Response } from "express";
import { invoiceService } from "../services/invoiceService";

export const InvoiceController = {
  list: async (req: Request, res: Response) => {
    const invoices = await invoiceService.list({
      country: req.user?.country,
      userId: req.user?.id,
      role: req.user?.roles?.[0],
    });
    res.json(invoices);
  },

  getById: async (req: Request, res: Response) => {
    const invoice = await invoiceService.getById(req.params.id);
    res.json(invoice);
  },

  create: async (req: Request, res: Response) => {
    const invoice = await invoiceService.create(req.body);
    res.status(201).json(invoice);
  },
};
