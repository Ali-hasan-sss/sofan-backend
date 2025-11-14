export declare const countryService: {
    list: () => Promise<{
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    create: (payload: unknown) => Promise<{
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update: (id: string, payload: unknown) => Promise<{
        id: string;
        name: string;
        code: string;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove: (id: string) => Promise<{
        success: boolean;
    }>;
};
//# sourceMappingURL=countryService.d.ts.map