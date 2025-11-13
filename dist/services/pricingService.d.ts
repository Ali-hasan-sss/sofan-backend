export declare const pricingService: {
    calculate: ({ payload }: {
        payload: unknown;
    }) => Promise<import("../utils/pricing").PricingResult>;
    listRates: () => Promise<{
        id: any;
        originBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        destinationBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        localCurrency: any;
        pricePerCubicMeterLocal: number;
        pricePerCubicMeterUsd: number;
        pickupDoorFeeLocal: number;
        pickupDoorFeeUsd: number;
        deliveryDoorFeeLocal: number;
        deliveryDoorFeeUsd: number;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }[]>;
    createRate: (payload: unknown) => Promise<{
        id: any;
        originBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        destinationBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        localCurrency: any;
        pricePerCubicMeterLocal: number;
        pricePerCubicMeterUsd: number;
        pickupDoorFeeLocal: number;
        pickupDoorFeeUsd: number;
        deliveryDoorFeeLocal: number;
        deliveryDoorFeeUsd: number;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }>;
    updateRate: (id: string, payload: unknown) => Promise<{
        id: any;
        originBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        destinationBranch: {
            id: any;
            name: any;
            code: any;
        } | undefined;
        localCurrency: any;
        pricePerCubicMeterLocal: number;
        pricePerCubicMeterUsd: number;
        pickupDoorFeeLocal: number;
        pickupDoorFeeUsd: number;
        deliveryDoorFeeLocal: number;
        deliveryDoorFeeUsd: number;
        isActive: any;
        createdAt: any;
        updatedAt: any;
    }>;
    removeRate: (id: string) => Promise<{
        id: string;
        deleted: boolean;
    }>;
};
//# sourceMappingURL=pricingService.d.ts.map