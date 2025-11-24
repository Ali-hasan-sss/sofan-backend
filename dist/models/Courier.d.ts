import { Document, Types } from "mongoose";
export interface CourierDocument extends Document {
    firstName: string;
    lastName: string;
    phone: string;
    email?: string;
    branch: Types.ObjectId;
    isActive: boolean;
    vehicleType?: string;
    licenseNumber?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const CourierModel: import("mongoose").Model<CourierDocument, {}, {}, {}, Document<unknown, {}, CourierDocument, {}, {}> & CourierDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Courier.d.ts.map