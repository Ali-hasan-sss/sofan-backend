import { z } from "zod";
export declare const countryCreateSchema: z.ZodObject<{
    name: z.ZodString;
    code: z.ZodString;
    phoneCode: z.ZodOptional<z.ZodString>;
    iso3: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
export declare const countryUpdateSchema: z.ZodObject<{
    name: z.ZodOptional<z.ZodString>;
    code: z.ZodOptional<z.ZodString>;
    phoneCode: z.ZodOptional<z.ZodString>;
    iso3: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=countrySchemas.d.ts.map