import { Document } from "mongoose";
export interface ShipmentCounterDocument extends Document {
    country: string;
    seq: number;
    updatedAt: Date;
}
export declare const ShipmentCounterModel: import("mongoose").Model<ShipmentCounterDocument, {}, {}, {}, Document<unknown, {}, ShipmentCounterDocument, {}, {}> & ShipmentCounterDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ShipmentCounter.d.ts.map