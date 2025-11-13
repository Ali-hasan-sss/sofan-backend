import { type Document, type Types } from "mongoose";
export interface StaffProfileDocument extends Document {
    user: Types.ObjectId;
    jobTitle?: string;
    permissions: string[];
    branch?: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const StaffProfileModel: import("mongoose").Model<StaffProfileDocument, {}, {}, {}, Document<unknown, {}, StaffProfileDocument, {}, {}> & StaffProfileDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=StaffProfile.d.ts.map