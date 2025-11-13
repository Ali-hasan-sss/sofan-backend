"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const pricingController_1 = require("../controllers/pricingController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.post("/calc", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE, roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(pricingController_1.PricingController.calculate));
router.get("/rates", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(pricingController_1.PricingController.listRates));
router.post("/rates", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(pricingController_1.PricingController.createRate));
router.patch("/rates/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(pricingController_1.PricingController.updateRate));
router.delete("/rates/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(pricingController_1.PricingController.removeRate));
exports.default = router;
//# sourceMappingURL=pricing.js.map