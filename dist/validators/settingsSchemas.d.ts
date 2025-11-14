import { z } from "zod";
export declare const systemSettingsUpdateSchema: z.ZodObject<{
    localCurrency: z.ZodPipe<z.ZodOptional<z.ZodUnion<readonly [z.ZodPipe<z.ZodString, z.ZodTransform<string, string>>, z.ZodLiteral<"">, z.ZodNull]>>, z.ZodTransform<string | null, string | null | undefined>>;
}, z.core.$strip>;
//# sourceMappingURL=settingsSchemas.d.ts.map