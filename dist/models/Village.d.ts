import { type Document, type Types } from "mongoose";
export interface VillageDocument extends Document {
    name: string;
    code?: string;
    district: Types.ObjectId;
    branch?: Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VillageModel: import("mongoose").Model<VillageDocument, {}, {}, {}, Document<unknown, {}, VillageDocument, {}, {}> & VillageDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Village.d.ts.map