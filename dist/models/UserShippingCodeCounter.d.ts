import { Document } from "mongoose";
export interface UserShippingCodeCounterDocument extends Document {
    country: string;
    seq: number;
    updatedAt: Date;
}
export declare const UserShippingCodeCounterModel: import("mongoose").Model<UserShippingCodeCounterDocument, {}, {}, {}, Document<unknown, {}, UserShippingCodeCounterDocument, {}, {}> & UserShippingCodeCounterDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=UserShippingCodeCounter.d.ts.map