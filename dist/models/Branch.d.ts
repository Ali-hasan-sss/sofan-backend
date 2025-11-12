import { Schema, Document } from "mongoose";
export interface BranchDocument extends Document {
    name: string;
    country: string;
    code: string;
    address: string;
    contactNumber?: string;
    isActive: boolean;
    manager?: Schema.Types.ObjectId;
    createdAt: Date;
    updatedAt: Date;
}
export declare const BranchModel: import("mongoose").Model<BranchDocument, {}, {}, {}, Document<unknown, {}, BranchDocument, {}, {}> & BranchDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Branch.d.ts.map