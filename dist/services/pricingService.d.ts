export declare const pricingService: {
    calculate: ({ payload, country, }: {
        payload: unknown;
        country: string;
    }) => Promise<import("../utils/pricing").PricingResult>;
    listRules: (country?: string) => Promise<{
        id: string;
        country: string;
        currency: string;
        volumetricDivisor: number;
        baseRate: number;
    }[]>;
    createRule: (payload: unknown) => Promise<{
        id: any;
        country: string;
        currency: string;
        volumetricDivisor: number;
        baseRate: number;
    }>;
};
//# sourceMappingURL=pricingService.d.ts.map