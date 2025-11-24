import { Document, Types } from "mongoose";
export type TrackingEventType = "created" | "approved" | "courier_assigned" | "task_created" | "picked_up" | "arrived_at_branch" | "departed_from_branch" | "in_transit" | "out_for_delivery" | "delivered" | "cancelled" | "scan";
export interface ShipmentTrackingDocument extends Document {
    shipment: Types.ObjectId;
    eventType: TrackingEventType;
    branch?: Types.ObjectId;
    courier?: Types.ObjectId;
    scannedBy?: Types.ObjectId;
    notes?: string;
    metadata?: Record<string, unknown>;
    createdAt: Date;
}
export declare const ShipmentTrackingModel: import("mongoose").Model<ShipmentTrackingDocument, {}, {}, {}, Document<unknown, {}, ShipmentTrackingDocument, {}, {}> & ShipmentTrackingDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=ShipmentTracking.d.ts.map