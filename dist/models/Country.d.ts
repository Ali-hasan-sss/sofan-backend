import { Document } from "mongoose";
export interface CountryDocument extends Document {
    name: string;
    code: string;
    phoneCode?: string;
    iso3?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CountryModel: import("mongoose").Model<CountryDocument, {}, {}, {}, Document<unknown, {}, CountryDocument, {}, {}> & CountryDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Country.d.ts.map