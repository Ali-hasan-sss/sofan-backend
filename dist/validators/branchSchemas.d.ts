import { z } from "zod";
export declare const branchCreateSchema: z.ZodObject<{
    name: z.ZodString;
    country: z.ZodString;
    code: z.ZodString;
    address: z.ZodString;
    contactNumber: z.ZodOptional<z.ZodString>;
    isActive: z.ZodDefault<z.ZodBoolean>;
    managerId: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const branchUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    country: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    address: z.ZodOptional<z.ZodString>;
    contactNumber: z.ZodOptional<z.ZodOptional<z.ZodString>>;
    isActive: z.ZodOptional<z.ZodBoolean>;
    managerId: z.ZodOptional<z.ZodNullable<z.ZodString>>;
}, z.core.$strip>;
//# sourceMappingURL=branchSchemas.d.ts.map