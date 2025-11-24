import { Document, Types } from "mongoose";
import { Dimensions, ShipmentType, Money } from "../types";
export type ShipmentStatus = "draft" | "pending_approval" | "approved" | "courier_assigned" | "picked_up" | "at_origin_branch" | "in_transit" | "at_transit_branch" | "at_destination_branch" | "out_for_delivery" | "delivered" | "cancelled";
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
    currentBranch?: Types.ObjectId;
    assignedCourier?: Types.ObjectId;
    deliveryProof?: {
        identityFrontImage?: string;
        identityBackImage?: string;
        signature?: string;
        deliveredAt?: Date;
        deliveredBy?: Types.ObjectId;
        codCollected?: number;
        codCurrency?: string;
    };
    createdAt: Date;
    updatedAt: Date;
}
export declare const ShipmentModel: import("mongoose").Model<ShipmentDocument, {}, {}, {}, Document<unknown, {}, ShipmentDocument, {}, {}> & ShipmentDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Shipment.d.ts.map