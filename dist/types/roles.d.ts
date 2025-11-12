export declare const ROLES: {
    readonly SUPER_ADMIN: "SUPER_ADMIN";
    readonly BRANCH_ADMIN: "BRANCH_ADMIN";
    readonly EMPLOYEE: "EMPLOYEE";
    readonly USER_PERSONAL: "USER_PERSONAL";
    readonly USER_BUSINESS: "USER_BUSINESS";
};
export type Role = (typeof ROLES)[keyof typeof ROLES];
export declare const ROLE_HIERARCHY: Record<Role, Role[]>;
export declare const DEFAULT_PERMISSIONS: {
    MANAGE_USERS: ("SUPER_ADMIN" | "BRANCH_ADMIN")[];
    MANAGE_BRANCHES: "SUPER_ADMIN"[];
    CREATE_SHIPMENT: ("BRANCH_ADMIN" | "EMPLOYEE" | "USER_PERSONAL" | "USER_BUSINESS")[];
    VIEW_WALLET: ("SUPER_ADMIN" | "BRANCH_ADMIN" | "USER_PERSONAL" | "USER_BUSINESS")[];
    MANAGE_PRICING: "SUPER_ADMIN"[];
};
//# sourceMappingURL=roles.d.ts.map