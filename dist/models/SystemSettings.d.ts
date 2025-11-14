import { type Document } from "mongoose";
export interface SystemSettingsDocument extends Document {
    localCurrency?: string | null;
    createdAt: Date;
    updatedAt: Date;
}
export declare const SystemSettingsModel: import("mongoose").Model<SystemSettingsDocument, {}, {}, {}, Document<unknown, {}, SystemSettingsDocument, {}, {}> & SystemSettingsDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=SystemSettings.d.ts.map