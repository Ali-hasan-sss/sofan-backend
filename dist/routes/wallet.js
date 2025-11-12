"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const walletController_1 = require("../controllers/walletController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/me", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(walletController_1.WalletController.getMyWallet));
router.get("/:userId", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(walletController_1.WalletController.getByUser));
exports.default = router;
//# sourceMappingURL=wallet.js.map