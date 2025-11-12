"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const adminController_1 = require("../controllers/adminController");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)(), (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN));
router.get("/overview", (0, asyncHandler_1.asyncHandler)(adminController_1.AdminController.overview));
exports.default = router;
//# sourceMappingURL=admin.js.map