import { z } from "zod";

const moneySchema = z.object({
  amount: z.number().nonnegative(),
  currency: z.string().min(2),
});

const addressSchema = z.object({
  name: z.string().min(1),
  phone: z.string().min(5),
  address: z.string().min(5),
  provinceId: z.string().min(1).optional(),
  districtId: z.string().min(1).optional(),
  villageId: z.string().min(1).optional(),
});

const packageSchema = z.object({
  length: z.number().positive(),
  width: z.number().positive(),
  height: z.number().positive(),
  weight: z.number().positive(),
  declaredValue: moneySchema,
  goodsType: z.string().min(1),
});

export const shipmentCreateSchema = z.object({
  type: z.enum([
    "door_to_door",
    "branch_to_branch",
    "branch_to_door",
    "door_to_branch",
  ]),
  branchFrom: z.string().min(1),
  branchTo: z.string().optional(),
  pricingCurrency: z.string().min(2),
  sender: addressSchema,
  recipient: addressSchema,
  packages: z.array(packageSchema).min(1),
  codAmount: z.number().nonnegative().optional(),
  codCurrency: z.string().min(2).optional(),
  insured: z.boolean().optional(),
});

export const shipmentFilterSchema = z.object({
  country: z.string().optional(),
  branch: z.string().optional(),
  status: z
    .enum([
      "draft",
      "pending_approval",
      "awaiting_pickup",
      "in_transit",
      "delivered",
      "cancelled",
    ])
    .optional(),
});
