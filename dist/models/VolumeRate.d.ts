import { type Document, type Types } from "mongoose";
export interface VolumeRateDocument extends Document {
    originBranch: Types.ObjectId;
    destinationBranch: Types.ObjectId;
    localCurrency: string;
    pricePerCubicMeterLocal: number;
    pricePerCubicMeterUsd: number;
    pickupDoorFeeLocal: number;
    pickupDoorFeeUsd: number;
    deliveryDoorFeeLocal: number;
    deliveryDoorFeeUsd: number;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const VolumeRateModel: import("mongoose").Model<VolumeRateDocument, {}, {}, {}, Document<unknown, {}, VolumeRateDocument, {}, {}> & VolumeRateDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=VolumeRate.d.ts.map