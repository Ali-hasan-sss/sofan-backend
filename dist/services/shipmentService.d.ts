import mongoose from "mongoose";
type ListParams = {
    country?: string;
    branch?: string;
    status?: string;
};
export declare const shipmentService: {
    list: (filters: ListParams) => Promise<{
        id: string;
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        pricing: mongoose.FlattenMaps<import("../models/Shipment").PricingBreakdown>;
        country: string;
        type: import("../types").ShipmentType;
        paymentMethod: "wallet" | "prepaid" | "cod" | "contract";
        isFragile: boolean;
        additionalInfo: string;
        goodsValue: mongoose.FlattenMaps<import("../types").Money> | null;
        sender: {
            name: string;
            phone: string;
            address: string;
        };
        recipient: {
            name: string;
            phone: string;
            address: string;
        };
        branchFrom: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        branchTo: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        packages: {
            quantity: number;
            goodsType: string;
            weight: number;
            volumetricWeight: number;
        }[];
        packagesCount: number;
        createdAt: Date;
    }[]>;
    create: ({ data, createdBy, country, }: {
        data: unknown;
        createdBy: string;
        country: string;
    }) => Promise<{
        id: any;
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        pricing: import("../utils/pricing").PricingResult;
    }>;
    getById: (id: string) => Promise<{
        id: string;
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        pricing: mongoose.FlattenMaps<import("../models/Shipment").PricingBreakdown>;
        packages: mongoose.FlattenMaps<import("../models/Shipment").PackageDetails>[];
        sender: {
            name: string;
            phone: string;
            address: string;
            provinceId: string | undefined;
            districtId: string | undefined;
            villageId: string | undefined;
        };
        recipient: {
            name: string;
            phone: string;
            address: string;
            provinceId: string | undefined;
            districtId: string | undefined;
            villageId: string | undefined;
        };
        approvals: mongoose.FlattenMaps<{
            approvedBy: mongoose.Types.ObjectId;
            approvedAt: Date;
        }>[];
    }>;
    getByNumber: (shipmentNumber: string) => Promise<{
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        country: string;
        sender: {
            name: string;
            phone: string;
            address: string;
            provinceId: string | undefined;
            districtId: string | undefined;
            villageId: string | undefined;
        };
        recipient: {
            name: string;
            phone: string;
            address: string;
            provinceId: string | undefined;
            districtId: string | undefined;
            villageId: string | undefined;
        };
        pricing: mongoose.FlattenMaps<import("../models/Shipment").PricingBreakdown>;
        packages: mongoose.FlattenMaps<import("../models/Shipment").PackageDetails>[];
        updatedAt: Date;
    }>;
};
export {};
//# sourceMappingURL=shipmentService.d.ts.map