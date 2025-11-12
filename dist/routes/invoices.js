"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const invoiceController_1 = require("../controllers/invoiceController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.USER_BUSINESS, roles_1.ROLES.USER_PERSONAL), (0, asyncHandler_1.asyncHandler)(invoiceController_1.InvoiceController.list));
router.get("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.USER_BUSINESS, roles_1.ROLES.USER_PERSONAL), (0, asyncHandler_1.asyncHandler)(invoiceController_1.InvoiceController.getById));
router.post("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(invoiceController_1.InvoiceController.create));
exports.default = router;
//# sourceMappingURL=invoices.js.map