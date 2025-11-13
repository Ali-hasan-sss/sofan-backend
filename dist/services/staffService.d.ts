export declare const staffService: {
    list: ({ branch, search }: {
        branch?: string;
        search?: string;
    }) => Promise<({
        id: any;
        jobTitle: any;
        permissions: any;
        isActive: any;
        branch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            branch: any;
            isActive: any;
        } | undefined;
        createdAt: any;
        updatedAt: any;
    } | null)[]>;
    create: (payload: {
        userId: string;
        jobTitle?: string;
        permissions?: string[];
        branchId?: string;
        isActive?: boolean;
    }) => Promise<{
        id: any;
        jobTitle: any;
        permissions: any;
        isActive: any;
        branch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            branch: any;
            isActive: any;
        } | undefined;
        createdAt: any;
        updatedAt: any;
    } | null>;
    update: (id: string, payload: {
        jobTitle?: string;
        permissions?: string[];
        branchId?: string | null;
        isActive?: boolean;
    }) => Promise<{
        id: any;
        jobTitle: any;
        permissions: any;
        isActive: any;
        branch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            branch: any;
            isActive: any;
        } | undefined;
        createdAt: any;
        updatedAt: any;
    } | null>;
    remove: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
    getStaffForUser: (userId: string) => Promise<{
        id: any;
        jobTitle: any;
        permissions: any;
        isActive: any;
        branch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        user: {
            id: any;
            email: any;
            firstName: any;
            lastName: any;
            role: any;
            status: any;
            branch: any;
            isActive: any;
        } | undefined;
        createdAt: any;
        updatedAt: any;
    } | null>;
};
//# sourceMappingURL=staffService.d.ts.map