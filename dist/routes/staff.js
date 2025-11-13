"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const staffController_1 = require("../controllers/staffController");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.use((0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN));
router.get("/", (0, asyncHandler_1.asyncHandler)(staffController_1.StaffController.list));
router.post("/", (0, asyncHandler_1.asyncHandler)(staffController_1.StaffController.create));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(staffController_1.StaffController.update));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(staffController_1.StaffController.remove));
exports.default = router;
//# sourceMappingURL=staff.js.map