import { z } from "zod";
export declare const adminCreateUserSchema: z.ZodObject<{
    email: z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>;
    firstName: z.ZodString;
    lastName: z.ZodString;
    role: z.ZodEnum<{
        [x: string]: string;
    }>;
    country: z.ZodOptional<z.ZodString>;
    password: z.ZodOptional<z.ZodString>;
}, z.core.$strip>;
//# sourceMappingURL=userSchemas.d.ts.map