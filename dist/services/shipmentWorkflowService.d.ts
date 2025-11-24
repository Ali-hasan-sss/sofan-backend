import mongoose, { Types } from "mongoose";
import type { ShipmentTaskDocument } from "../models/ShipmentTask";
export declare const shipmentWorkflowService: {
    /**
     * Find the branch responsible for a sender's location
     */
    findBranchForSender: (districtId?: string, provinceId?: string) => Promise<string | null>;
    /**
     * Approve a shipment by branch admin
     */
    approveShipment: (shipmentId: string, approvedBy: string, branchId: string) => Promise<mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * Assign a courier to a shipment
     */
    assignCourier: (shipmentId: string, courierId: string, assignedBy: string, options?: {
        targetBranchId?: string;
        notes?: string;
    }) => Promise<mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
        _id: unknown;
    }> & {
        __v: number;
    }>;
    /**
     * List active couriers for a branch
     */
    getCouriersForBranch: (branchId: string) => Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string;
        vehicleType: string | undefined;
    }[]>;
    /**
     * List active employees for a branch (for task assignment)
     */
    getEmployeesForBranch: (branchId: string) => Promise<{
        id: string;
        firstName: string;
        lastName: string;
        phone: string | undefined;
        email: string;
    }[]>;
    /**
     * List tasks for a branch (branch staff visibility)
     */
    getTasksForBranch: (branchId: string, params?: {
        status?: string;
        employeeId?: string;
    }) => Promise<{
        id: string;
        taskType: import("../models/ShipmentTask").ShipmentTaskType;
        status: import("../models/ShipmentTask").ShipmentTaskStatus;
        courier: {
            id: any;
            firstName: any;
            lastName: any;
            phone: any;
        } | undefined;
        shipment: {
            id: string;
            shipmentNumber: any;
            status: any;
            senderName: any;
            recipientName: any;
        } | undefined;
        branchFrom: {
            id: string;
            name: any;
            code: any;
        } | undefined;
        branchTo: {
            id: string;
            name: any;
            code: any;
        } | undefined;
        notes: string | undefined;
        createdAt: Date;
        startedAt: Date | undefined;
        completedAt: Date | undefined;
    }[]>;
    /**
     * Manually create a shipment task (pickup/transfer/delivery) by branch staff
     */
    createTask: (shipmentId: string, branchId: string, createdBy: string, params: {
        employeeId?: string;
        courierId?: string;
        taskType?: "pickup" | "transfer" | "delivery";
        targetBranchId?: string;
        notes?: string;
    }) => Promise<{
        shipment: mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        task: mongoose.Document<unknown, {}, ShipmentTaskDocument, {}, {}> & ShipmentTaskDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Start a task (employee accepts the task)
     */
    startTask: (taskId: string, userId: string) => Promise<{
        task: mongoose.Document<unknown, {}, ShipmentTaskDocument, {}, {}> & ShipmentTaskDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Scan shipment - pickup by courier or branch
     */
    scanPickup: (shipmentId: string, scannedBy: string, location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    }, notes?: string) => Promise<{
        shipment: mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        scan: mongoose.Document<unknown, {}, import("../models/Scan").ScanDocument, {}, {}> & import("../models/Scan").ScanDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Scan shipment - arrival at branch
     */
    scanArrivalAtBranch: (shipmentId: string, branchId: string, scannedBy: string, location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    }, notes?: string) => Promise<{
        shipment: mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        scan: mongoose.Document<unknown, {}, import("../models/Scan").ScanDocument, {}, {}> & import("../models/Scan").ScanDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Scan shipment - departure from branch
     */
    scanDepartureFromBranch: (shipmentId: string, branchId: string, scannedBy: string, nextBranchId?: string, courierId?: string, location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    }, notes?: string) => Promise<{
        shipment: mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        scan: mongoose.Document<unknown, {}, import("../models/Scan").ScanDocument, {}, {}> & import("../models/Scan").ScanDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Scan shipment - delivery to recipient
     */
    scanDelivery: (shipmentId: string, scannedBy: string, location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    }, notes?: string, deliveryProof?: {
        identityFrontImage?: string;
        identityBackImage?: string;
        signature?: string;
        codCollected?: number;
        codCurrency?: string;
    }) => Promise<{
        shipment: mongoose.Document<unknown, {}, import("../models/Shipment").ShipmentDocument, {}, {}> & import("../models/Shipment").ShipmentDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
        scan: mongoose.Document<unknown, {}, import("../models/Scan").ScanDocument, {}, {}> & import("../models/Scan").ScanDocument & Required<{
            _id: unknown;
        }> & {
            __v: number;
        };
    }>;
    /**
     * Get shipments pending approval for a branch
     */
    getPendingShipmentsForBranch: (branchId: string) => Promise<{
        id: string;
        shipmentNumber: string;
        status: import("../models/Shipment").ShipmentStatus;
        sender: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
            province?: Types.ObjectId;
            district?: Types.ObjectId;
            village?: Types.ObjectId;
        }>;
        recipient: mongoose.FlattenMaps<{
            name: string;
            phone: string;
            address: string;
            province?: Types.ObjectId;
            district?: Types.ObjectId;
            village?: Types.ObjectId;
        }>;
        packagesCount: number;
        pricing: mongoose.FlattenMaps<import("../models/Shipment").PricingBreakdown>;
        createdAt: Date;
        createdBy: Types.ObjectId;
    }[]>;
    /**
     * Get tracking history for a shipment
     */
    getShipmentTracking: (shipmentId: string) => Promise<{
        id: string;
        eventType: import("../models/ShipmentTracking").TrackingEventType;
        branch: Types.ObjectId | undefined;
        courier: Types.ObjectId | undefined;
        scannedBy: Types.ObjectId | undefined;
        notes: string | undefined;
        metadata: mongoose.FlattenMaps<Record<string, unknown>> | undefined;
        createdAt: Date;
    }[]>;
};
//# sourceMappingURL=shipmentWorkflowService.d.ts.map