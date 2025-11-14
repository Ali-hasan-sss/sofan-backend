import { type Document } from "mongoose";
export interface GoodsTypeDocument extends Document {
    name: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const GoodsTypeModel: import("mongoose").Model<GoodsTypeDocument, {}, {}, {}, Document<unknown, {}, GoodsTypeDocument, {}, {}> & GoodsTypeDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=GoodsType.d.ts.map