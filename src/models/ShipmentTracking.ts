import { Schema, model, Document, Types } from "mongoose";

export type TrackingEventType =
  | "created"
  | "approved"
  | "courier_assigned"
  | "task_created"
  | "picked_up"
  | "arrived_at_branch"
  | "departed_from_branch"
  | "in_transit"
  | "out_for_delivery"
  | "delivered"
  | "cancelled"
  | "scan";

export interface ShipmentTrackingDocument extends Document {
  shipment: Types.ObjectId;
  eventType: TrackingEventType;
  branch?: Types.ObjectId; // Branch where event occurred
  courier?: Types.ObjectId; // Courier involved in the event
  scannedBy?: Types.ObjectId; // User who scanned (if scan event)
  notes?: string;
  metadata?: Record<string, unknown>; // Additional data (e.g., GPS coordinates, photos)
  createdAt: Date;
}

const ShipmentTrackingSchema = new Schema<ShipmentTrackingDocument>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      index: true,
    },
    eventType: {
      type: String,
      enum: [
        "created",
        "approved",
        "courier_assigned",
        "task_created",
        "picked_up",
        "arrived_at_branch",
        "departed_from_branch",
        "in_transit",
        "out_for_delivery",
        "delivered",
        "cancelled",
        "scan",
      ],
      required: true,
    },
    branch: { type: Schema.Types.ObjectId, ref: "Branch" },
    courier: { type: Schema.Types.ObjectId, ref: "Courier" },
    scannedBy: { type: Schema.Types.ObjectId, ref: "User" },
    notes: { type: String },
    metadata: { type: Schema.Types.Mixed },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

ShipmentTrackingSchema.index({ shipment: 1, createdAt: -1 });
ShipmentTrackingSchema.index({ branch: 1, createdAt: -1 });
ShipmentTrackingSchema.index({ courier: 1, createdAt: -1 });

export const ShipmentTrackingModel = model<ShipmentTrackingDocument>(
  "ShipmentTracking",
  ShipmentTrackingSchema
);
