import { type Role } from "../types/roles";
export declare const userService: {
    createByAdmin: (payload: unknown) => Promise<{
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            country: any;
            shippingCode: any;
            branch: any;
            isActive: any;
            createdAt: any;
        };
        generatedPassword: string;
    }>;
    listStaff: () => Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
    }[]>;
    list: ({ status, role, search, }: {
        status?: string;
        role?: string;
        search?: string;
    }) => Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        status: import("../models/User").UserStatus;
        country: string;
        shippingCode: string | undefined;
        createdAt: Date;
        isActive: boolean;
    }[]>;
    listPending: (country?: string) => Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: Role;
        country: string;
        shippingCode: string | undefined;
        isActive: boolean;
    }[]>;
    updateStatus: (userId: string, status: "approved" | "rejected", approvedBy?: string) => Promise<{
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            country: any;
            shippingCode: any;
            branch: any;
            isActive: any;
            createdAt: any;
        };
        approvedBy: string | undefined;
    }>;
    setActiveState: (userId: string, isActive: boolean) => Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        role: any;
        status: any;
        country: any;
        shippingCode: any;
        branch: any;
        isActive: any;
        createdAt: any;
    }>;
    update: (userId: string, payload: unknown) => Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        role: any;
        status: any;
        country: any;
        shippingCode: any;
        branch: any;
        isActive: any;
        createdAt: any;
    }>;
    deleteUser: (userId: string) => Promise<{
        id: string;
    }>;
    updateProfile: (userId: string, payload: {
        firstName?: string;
        lastName?: string;
        email?: string;
        phone?: string;
    }) => Promise<{
        id: any;
        email: any;
        firstName: any;
        lastName: any;
        role: any;
        status: any;
        country: any;
        shippingCode: any;
        branch: any;
        isActive: any;
        createdAt: any;
    }>;
    changePassword: (userId: string, currentPassword: string, newPassword: string) => Promise<{
        success: boolean;
    }>;
    getDashboardOverview: (userId: string) => Promise<{
        totalShipments: number;
        pendingShipments: number;
        completedShipments: number;
        walletBalance: {
            local: number;
            usd: number;
        };
        recentShipments: {
            id: string;
            shipmentNumber: string;
            status: import("../models/Shipment").ShipmentStatus;
            createdAt: Date;
        }[];
    }>;
    deleteMyAccount: (userId: string, password: string) => Promise<{
        success: boolean;
        message: string;
    }>;
};
//# sourceMappingURL=userService.d.ts.map