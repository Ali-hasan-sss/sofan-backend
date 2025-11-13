export declare const locationService: {
    listHierarchy: () => Promise<{
        id: string;
        name: string;
        code: string | undefined;
        country: string;
        districts: Record<string, unknown>[];
    }[]>;
    createProvince: (payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        country: string;
    }>;
    updateProvince: (id: string, payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        country: string;
    }>;
    deleteProvince: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
    createDistrict: (payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        provinceId: string;
        branchId: any;
    }>;
    updateDistrict: (id: string, payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        provinceId: string;
        branchId: string | undefined;
    }>;
    deleteDistrict: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
    createVillage: (payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        districtId: string;
        branchId: any;
    }>;
    updateVillage: (id: string, payload: unknown) => Promise<{
        id: any;
        name: string;
        code: string | undefined;
        districtId: string;
        branchId: string | undefined;
    }>;
    deleteVillage: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
    findBranchForVillage: (villageId?: string) => Promise<string | undefined>;
};
//# sourceMappingURL=locationService.d.ts.map