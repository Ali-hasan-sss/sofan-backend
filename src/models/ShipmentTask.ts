import { Schema, model, type Document, Types } from "mongoose";

export type ShipmentTaskType = "pickup" | "transfer" | "delivery";

export type ShipmentTaskStatus =
  | "pending"
  | "in_progress"
  | "completed"
  | "cancelled";

export interface ShipmentTaskDocument extends Document {
  shipment: Types.ObjectId;
  taskType: ShipmentTaskType;
  employee: Types.ObjectId;
  courier?: Types.ObjectId; // Optional, for backward compatibility
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

const ShipmentTaskSchema = new Schema<ShipmentTaskDocument>(
  {
    shipment: {
      type: Schema.Types.ObjectId,
      ref: "Shipment",
      required: true,
      index: true,
    },
    taskType: {
      type: String,
      enum: ["pickup", "transfer", "delivery"],
      required: true,
    },
    employee: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    courier: {
      type: Schema.Types.ObjectId,
      ref: "Courier",
      required: false,
      index: true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    branchFrom: { type: Schema.Types.ObjectId, ref: "Branch" },
    branchTo: { type: Schema.Types.ObjectId, ref: "Branch" },
    notes: { type: String },
    status: {
      type: String,
      enum: ["pending", "in_progress", "completed", "cancelled"],
      default: "pending",
      index: true,
    },
    startedAt: { type: Date },
    completedAt: { type: Date },
  },
  { timestamps: true }
);

ShipmentTaskSchema.index({ shipment: 1, taskType: 1, status: 1 });
ShipmentTaskSchema.index({ branchTo: 1, status: 1 });

export const ShipmentTaskModel = model<ShipmentTaskDocument>(
  "ShipmentTask",
  ShipmentTaskSchema
);
