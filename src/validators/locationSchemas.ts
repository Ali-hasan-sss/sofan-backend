import { z } from "zod";

export const createProvinceSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).optional(),
  country: z.string().min(2).optional(),
});

export const updateProvinceSchema = createProvinceSchema.partial();

export const createDistrictSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).optional(),
  provinceId: z.string().min(1),
  branchId: z.string().min(1).optional(),
});

export const updateDistrictSchema = createDistrictSchema
  .omit({ provinceId: true })
  .partial()
  .extend({
    provinceId: z.string().min(1).optional(),
  });

export const createVillageSchema = z.object({
  name: z.string().min(1),
  code: z.string().min(1).optional(),
  districtId: z.string().min(1),
  branchId: z.string().min(1).optional(),
});

export const updateVillageSchema = createVillageSchema
  .omit({ districtId: true })
  .partial()
  .extend({
    districtId: z.string().min(1).optional(),
  });
