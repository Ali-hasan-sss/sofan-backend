import { type Document } from "mongoose";
export interface ProvinceDocument extends Document {
    name: string;
    code?: string;
    country: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ProvinceModel: import("mongoose").Model<ProvinceDocument, {}, {}, {}, Document<unknown, {}, ProvinceDocument, {}, {}> & ProvinceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Province.d.ts.map