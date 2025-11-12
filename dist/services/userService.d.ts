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
        role: import("../types/roles").Role;
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
        role: import("../types/roles").Role;
        status: import("../models/User").UserStatus;
        country: string;
        createdAt: Date;
        isActive: boolean;
    }[]>;
    listPending: (country?: string) => Promise<{
        id: string;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../types/roles").Role;
        country: string;
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
        branch: any;
        isActive: any;
        createdAt: any;
    }>;
    deleteUser: (userId: string) => Promise<{
        id: string;
    }>;
};
//# sourceMappingURL=userService.d.ts.map