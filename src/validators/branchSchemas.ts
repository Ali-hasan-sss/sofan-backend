import { z } from "zod";

export const branchCreateSchema = z.object({
  name: z.string().min(1),
  country: z.string().min(2),
  code: z.string().min(2),
  address: z.string().min(1),
  contactNumber: z.string().optional(),
  isActive: z.boolean().default(true),
  managerId: z.string().optional(),
});

export const branchUpdateSchema = branchCreateSchema.partial().extend({
  isActive: z.boolean().optional(),
  managerId: z.string().nullable().optional(),
});
