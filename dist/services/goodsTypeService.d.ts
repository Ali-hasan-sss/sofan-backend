export declare const goodsTypeService: {
    list: () => Promise<{
        id: any;
        name: any;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    listActive: () => Promise<{
        id: any;
        name: any;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    create: (payload: unknown) => Promise<{
        id: any;
        name: any;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }>;
    update: (id: string, payload: unknown) => Promise<{
        id: any;
        name: any;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }>;
    remove: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
};
//# sourceMappingURL=goodsTypeService.d.ts.map