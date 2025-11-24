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
    addCredit: (userId: string, amount: number, currency: string, reference: string, meta?: Record<string, unknown>) => Promise<{
        id: string;
        balance: number;
        currency: string;
    }>;
};
//# sourceMappingURL=walletService.d.ts.map