import { type Document, Types } from "mongoose";
export type ShipmentTaskType = "pickup" | "transfer" | "delivery";
export type ShipmentTaskStatus = "pending" | "in_progress" | "completed" | "cancelled";
export interface ShipmentTaskDocument extends Document {
    shipment: Types.ObjectId;
    taskType: ShipmentTaskType;
    employee: Types.ObjectId;
    courier?: Types.ObjectId;
    createdBy: Types.ObjectId;
    branchFrom?: Types.ObjectId;
    branchTo?: Types.ObjectId;
    notes?: string;
    status: ShipmentTaskStatus;
    startedAt?: Date;
    completedAt?: Date;
    createdAt: Date;
    updatedAt: Date;
}
export declare const ShipmentTaskModel: import("mongoose").Model<ShipmentTaskDocument, {}, {}, {}, Document<unknown, {}, ShipmentTaskDocument, {}, {}> & ShipmentTaskDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ShipmentTask.d.ts.map