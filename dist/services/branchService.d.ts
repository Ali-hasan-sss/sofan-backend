export declare const branchService: {
    list: (country?: string) => Promise<{
        id: any;
        name: string;
        code: string;
        address: string;
        country: string;
        isActive: boolean;
        contactNumber: string | undefined;
        manager: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        } | undefined;
    }[]>;
    create: (payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string;
        address: string;
        country: string;
        isActive: boolean;
        contactNumber: string | undefined;
        manager: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        } | undefined;
    }>;
    update: (id: string, payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string;
        address: string;
        country: string;
        isActive: boolean;
        contactNumber: string | undefined;
        manager: {
            id: string;
            firstName: string;
            lastName: string;
            email: string;
            role: string;
        } | undefined;
    }>;
    remove: (id: string) => Promise<{
        id: any;
        deleted: boolean;
    }>;
};
//# sourceMappingURL=branchService.d.ts.map