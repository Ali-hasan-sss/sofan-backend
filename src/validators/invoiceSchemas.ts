import { z } from "zod";

const lineItemSchema = z.object({
  shipment: z.string(),
  description: z.string().min(1),
  amount: z.number().nonnegative(),
  currency: z.string().min(2),
});

export const invoiceCreateSchema = z.object({
  user: z.string(),
  branch: z.string().optional(),
  country: z.string().min(2),
  lineItems: z.array(lineItemSchema).min(1),
  totalAmount: z.number().nonnegative(),
  currency: z.string().min(2),
  dueAt: z.string().transform((value) => new Date(value)).optional(),
});


