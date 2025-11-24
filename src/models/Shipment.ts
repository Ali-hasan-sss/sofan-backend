import { Schema, model, Document, Types } from "mongoose";
import { Dimensions, ShipmentType, Money } from "../types";

export type ShipmentStatus =
  | "draft"
  | "pending_approval" // الطلب معلق - يظهر للفرع
  | "approved" // تم قبول الطلب من الفرع
  | "courier_assigned" // تم تعيين مندوب
  | "picked_up" // تم الاستلام من قبل المندوب
  | "at_origin_branch" // في الفرع المرسل
  | "in_transit" // في الطريق بين الفروع
  | "at_transit_branch" // في فرع عبور
  | "at_destination_branch" // في الفرع المستلم
  | "out_for_delivery" // في الطريق للتسليم
  | "delivered" // تم التسليم
  | "cancelled"; // ملغي

export interface PackageDetails extends Dimensions {
  volumetricWeight: number;
  quantity: number;
}

export interface PricingBreakdown {
  baseRate: number;
  weightCharge: number;
  volumetricWeight: number;
  pickupFee: number;
  deliveryFee: number;
  codFee: number;
  insuranceFee: number;
  currency: string;
  total: number;
}

export interface ShipmentDocument extends Document {
  shipmentNumber: string;
  country: string;
  type: ShipmentType;
  paymentMethod: "prepaid" | "cod" | "contract" | "wallet";
  isFragile: boolean;
  additionalInfo?: string;
  goodsValue?: Money;
  branchFrom?: Types.ObjectId;
  branchTo?: Types.ObjectId;
  createdBy: Types.ObjectId;
  sender: {
    name: string;
    phone: string;
    address: string;
    province?: Types.ObjectId;
    district?: Types.ObjectId;
    village?: Types.ObjectId;
  };
  recipient: {
    name: string;
    phone: string;
    address: string;
    province?: Types.ObjectId;
    district?: Types.ObjectId;
    village?: Types.ObjectId;
  };
  packages: PackageDetails[];
  pricing: PricingBreakdown;
  codAmount?: number;
  codCurrency?: string;
  walletTransaction?: Types.ObjectId;
  status: ShipmentStatus;
  approvals: { approvedBy: Types.ObjectId; approvedAt: Date }[];
  currentBranch?: Types.ObjectId; // الفرع الحالي للشحنة
  assignedCourier?: Types.ObjectId; // المندوب المعين
  deliveryProof?: {
    identityFrontImage?: string; // Base64 image of ID front
    identityBackImage?: string; // Base64 image of ID back
    signature?: string; // Base64 signature image
    deliveredAt?: Date;
    deliveredBy?: Types.ObjectId; // Employee/Courier who delivered
    codCollected?: number; // Actual COD amount collected
    codCurrency?: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const AddressSchema = new Schema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    address: { type: String, required: true },
    province: { type: Schema.Types.ObjectId, ref: "Province" },
    district: { type: Schema.Types.ObjectId, ref: "District" },
    village: { type: Schema.Types.ObjectId, ref: "Village" },
  },
  { _id: false }
);

const MoneySchema = new Schema(
  {
    amount: { type: Number, required: true },
    currency: { type: String, required: true },
  },
  { _id: false }
);

const PackageSchema = new Schema<PackageDetails>(
  {
    quantity: { type: Number, required: true, min: 1, default: 1 },
    length: { type: Number, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    weight: { type: Number, required: true },
    declaredValue: { type: MoneySchema, required: true },
    goodsType: { type: String, required: true },
    volumetricWeight: { type: Number, required: true },
  },
  { _id: false }
);

const PricingBreakdownSchema = new Schema<PricingBreakdown>(
  {
    baseRate: { type: Number, required: true },
    weightCharge: { type: Number, required: true },
    volumetricWeight: { type: Number, required: true },
    pickupFee: { type: Number, required: true },
    deliveryFee: { type: Number, required: true },
    codFee: { type: Number, required: true },
    insuranceFee: { type: Number, required: true },
    currency: { type: String, required: true },
    total: { type: Number, required: true },
  },
  { _id: false }
);

const ShipmentSchema = new Schema<ShipmentDocument>(
  {
    shipmentNumber: { type: String, required: true, unique: true },
    country: { type: String, required: true, index: true },
    type: {
      type: String,
      enum: [
        "door_to_door",
        "branch_to_branch",
        "branch_to_door",
        "door_to_branch",
      ],
      required: true,
    },
    branchFrom: { type: Schema.Types.ObjectId, ref: "Branch" },
    branchTo: { type: Schema.Types.ObjectId, ref: "Branch" },
    createdBy: { type: Schema.Types.ObjectId, ref: "User", required: true },
    sender: { type: AddressSchema, required: true },
    recipient: { type: AddressSchema, required: true },
    packages: { type: [PackageSchema], required: true },
    pricing: { type: PricingBreakdownSchema, required: true },
    paymentMethod: {
      type: String,
      enum: ["prepaid", "cod", "contract", "wallet"],
      required: true,
    },
    isFragile: { type: Boolean, default: false },
    additionalInfo: { type: String },
    goodsValue: { type: MoneySchema },
    codAmount: { type: Number },
    codCurrency: { type: String },
    walletTransaction: { type: Schema.Types.ObjectId, ref: "Wallet" },
    deliveryProof: {
      identityFrontImage: { type: String },
      identityBackImage: { type: String },
      signature: { type: String },
      deliveredAt: { type: Date },
      deliveredBy: { type: Schema.Types.ObjectId, ref: "User" },
      codCollected: { type: Number },
      codCurrency: { type: String },
    },
    status: {
      type: String,
      enum: [
        "draft",
        "pending_approval",
        "approved",
        "courier_assigned",
        "picked_up",
        "at_origin_branch",
        "in_transit",
        "at_transit_branch",
        "at_destination_branch",
        "out_for_delivery",
        "delivered",
        "cancelled",
      ],
      default: "pending_approval",
    },
    currentBranch: { type: Schema.Types.ObjectId, ref: "Branch", index: true },
    assignedCourier: { type: Schema.Types.ObjectId, ref: "Courier" },
    approvals: {
      type: [
        {
          approvedBy: {
            type: Schema.Types.ObjectId,
            ref: "User",
            required: true,
          },
          approvedAt: { type: Date, required: true },
        },
      ],
      default: [],
    },
  },
  { timestamps: true }
);

ShipmentSchema.index({ country: 1, createdAt: -1 });

export const ShipmentModel = model<ShipmentDocument>(
  "Shipment",
  ShipmentSchema
);
