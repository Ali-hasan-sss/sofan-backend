export declare const invoiceService: {
    list: ({ country, userId, role, }: {
        country?: string;
        userId?: string;
        role?: string;
    }) => Promise<{
        id: string;
        invoiceNumber: string;
        totalAmount: number;
        currency: string;
        status: import("../models/Invoice").InvoiceStatus;
        issuedAt: Date | undefined;
    }[]>;
    getById: (id: string) => Promise<import("mongoose").FlattenMaps<import("../models/Invoice").InvoiceDocument> & Required<{
        _id: import("mongoose").FlattenMaps<unknown>;
    }> & {
        __v: number;
    }>;
    create: (payload: unknown) => Promise<{
        id: any;
        invoiceNumber: string;
        status: import("../models/Invoice").InvoiceStatus;
        totalAmount: number;
        currency: string;
    }>;
};
//# sourceMappingURL=invoiceService.d.ts.map