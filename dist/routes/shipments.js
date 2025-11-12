"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const shipmentController_1 = require("../controllers/shipmentController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.get("/track/:number", (0, asyncHandler_1.asyncHandler)(shipmentController_1.ShipmentController.trackPublic));
router.use((0, auth_1.authenticate)());
router.get("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE, roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(shipmentController_1.ShipmentController.list));
router.post("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE, roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(shipmentController_1.ShipmentController.create));
router.get("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE, roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(shipmentController_1.ShipmentController.getById));
exports.default = router;
//# sourceMappingURL=shipments.js.map