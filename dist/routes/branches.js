"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const branchController_1 = require("../controllers/branchController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/", (0, asyncHandler_1.asyncHandler)(branchController_1.BranchController.list));
router.post("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(branchController_1.BranchController.create));
router.patch("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(branchController_1.BranchController.update));
router.delete("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(branchController_1.BranchController.remove));
exports.default = router;
//# sourceMappingURL=branches.js.map