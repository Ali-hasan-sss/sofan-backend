"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_PERMISSIONS = exports.ROLE_HIERARCHY = exports.ROLES = void 0;
exports.ROLES = {
    SUPER_ADMIN: "SUPER_ADMIN",
    BRANCH_ADMIN: "BRANCH_ADMIN",
    EMPLOYEE: "EMPLOYEE",
    USER_PERSONAL: "USER_PERSONAL",
    USER_BUSINESS: "USER_BUSINESS",
};
exports.ROLE_HIERARCHY = {
    SUPER_ADMIN: Object.values(exports.ROLES),
    BRANCH_ADMIN: [
        exports.ROLES.BRANCH_ADMIN,
        exports.ROLES.EMPLOYEE,
        exports.ROLES.USER_PERSONAL,
        exports.ROLES.USER_BUSINESS,
    ],
    EMPLOYEE: [exports.ROLES.EMPLOYEE],
    USER_PERSONAL: [exports.ROLES.USER_PERSONAL],
    USER_BUSINESS: [exports.ROLES.USER_BUSINESS],
};
exports.DEFAULT_PERMISSIONS = {
    MANAGE_USERS: [exports.ROLES.SUPER_ADMIN, exports.ROLES.BRANCH_ADMIN],
    MANAGE_BRANCHES: [exports.ROLES.SUPER_ADMIN],
    CREATE_SHIPMENT: [
        exports.ROLES.BRANCH_ADMIN,
        exports.ROLES.EMPLOYEE,
        exports.ROLES.USER_PERSONAL,
        exports.ROLES.USER_BUSINESS,
    ],
    VIEW_WALLET: [
        exports.ROLES.SUPER_ADMIN,
        exports.ROLES.BRANCH_ADMIN,
        exports.ROLES.USER_PERSONAL,
        exports.ROLES.USER_BUSINESS,
    ],
    MANAGE_PRICING: [exports.ROLES.SUPER_ADMIN],
};
//# sourceMappingURL=roles.js.map