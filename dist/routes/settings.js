"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const settingsController_1 = require("../controllers/settingsController");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/", (0, asyncHandler_1.asyncHandler)(settingsController_1.SettingsController.get));
router.patch("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(settingsController_1.SettingsController.update));
exports.default = router;
//# sourceMappingURL=settings.js.map