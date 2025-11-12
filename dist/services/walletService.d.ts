export declare const walletService: {
    getByUser: (userId: string) => Promise<{
        balance: number;
        currency: string;
        transactions: never[];
        id?: undefined;
    } | {
        id: string;
        balance: number;
        currency: string;
        transactions: import("mongoose").FlattenMaps<import("../models/Wallet").WalletTransaction>[];
    }>;
};
//# sourceMappingURL=walletService.d.ts.map