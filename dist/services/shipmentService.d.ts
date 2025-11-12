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
        sender: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
        }>;
        recipient: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
        }>;
        approvals: mongoose.FlattenMaps<{
            approvedBy: mongoose.Types.ObjectId;
            approvedAt: Date;
        }>[];
    }>;
    getByNumber: (shipmentNumber: string) => Promise<{
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        country: string;
        sender: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
        }>;
        recipient: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
        }>;
        pricing: mongoose.FlattenMaps<import("../models/Shipment").PricingBreakdown>;
        packages: mongoose.FlattenMaps<import("../models/Shipment").PackageDetails>[];
        updatedAt: Date;
    }>;
};
export {};
//# sourceMappingURL=shipmentService.d.ts.map