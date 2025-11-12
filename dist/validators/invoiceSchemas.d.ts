import { z } from "zod";
export declare const invoiceCreateSchema: z.ZodObject<{
    user: z.ZodString;
    branch: z.ZodOptional<z.ZodString>;
    country: z.ZodString;
    lineItems: z.ZodArray<z.ZodObject<{
        shipment: z.ZodString;
        description: z.ZodString;
        amount: z.ZodNumber;
        currency: z.ZodString;
    }, z.core.$strip>>;
    totalAmount: z.ZodNumber;
    currency: z.ZodString;
    dueAt: z.ZodOptional<z.ZodPipe<z.ZodString, z.ZodTransform<Date, string>>>;
}, z.core.$strip>;
//# sourceMappingURL=invoiceSchemas.d.ts.map