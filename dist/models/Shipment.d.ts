import { Document, Types } from "mongoose";
import { Dimensions, ShipmentType, Money } from "../types";
export type ShipmentStatus = "draft" | "pending_approval" | "awaiting_pickup" | "in_transit" | "delivered" | "cancelled";
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
    approvals: {
        approvedBy: Types.ObjectId;
        approvedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
export declare const ShipmentModel: import("mongoose").Model<ShipmentDocument, {}, {}, {}, Document<unknown, {}, ShipmentDocument, {}, {}> & ShipmentDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Shipment.d.ts.map