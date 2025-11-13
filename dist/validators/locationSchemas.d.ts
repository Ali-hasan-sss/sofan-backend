import { z } from "zod";
export declare const createProvinceSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateProvinceSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    country: z.ZodOptional<z.ZodOptional<z.ZodString>>;
}, z.core.$strip>;
export declare const createDistrictSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    provinceId: z.ZodString;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateDistrictSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    provinceId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const createVillageSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodOptional<z.ZodString>;
    districtId: z.ZodString;
    branchId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const updateVillageSchema: z.ZodObject<{
    code: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    name: z.ZodOptional<z.ZodString>;
    branchId: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    districtId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=locationSchemas.d.ts.map