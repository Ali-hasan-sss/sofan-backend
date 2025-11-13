import { type Document, type Types } from "mongoose";
export interface DistrictDocument extends Document {
    name: string;
    code?: string;
    province: Types.ObjectId;
    branch?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const DistrictModel: import("mongoose").Model<DistrictDocument, {}, {}, {}, Document<unknown, {}, DistrictDocument, {}, {}> & DistrictDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=District.d.ts.map