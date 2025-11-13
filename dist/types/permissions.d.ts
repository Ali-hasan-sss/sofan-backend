export declare const PERMISSIONS: {
    readonly MANAGE_USERS: "MANAGE_USERS";
    readonly MANAGE_BRANCHES: "MANAGE_BRANCHES";
    readonly MANAGE_LOCATIONS: "MANAGE_LOCATIONS";
    readonly MANAGE_SHIPMENTS: "MANAGE_SHIPMENTS";
    readonly MANAGE_PRICING: "MANAGE_PRICING";
    readonly MANAGE_WALLET: "MANAGE_WALLET";
    readonly VIEW_REPORTS: "VIEW_REPORTS";
};
export type Permission = (typeof PERMISSIONS)[keyof typeof PERMISSIONS];
export declare const PERMISSION_LIST: Permission[];
//# sourceMappingURL=permissions.d.ts.map