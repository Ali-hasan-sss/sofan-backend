import { z } from "zod";

export const goodsTypeCreateSchema = z.object({
  name: z.string().min(2).max(100),
  description: z.string().max(500).optional(),
  isActive: z.boolean().optional(),
});

export const goodsTypeUpdateSchema = goodsTypeCreateSchema.partial();

