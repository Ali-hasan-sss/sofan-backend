"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireRoles = void 0;
const roles_1 = require("../types/roles");
const requireRoles = (...roles) => (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ message: "Unauthorized" });
    }
    const userRoles = req.user.roles;
    const hasAccess = userRoles.some((role) => {
        const allowed = roles_1.ROLE_HIERARCHY[role] ?? [];
        return roles.some((required) => allowed.includes(required));
    });
    if (!hasAccess) {
        return res.status(403).json({ message: "Forbidden" });
    }
    return next();
};
exports.requireRoles = requireRoles;
//# sourceMappingURL=rbac.js.map