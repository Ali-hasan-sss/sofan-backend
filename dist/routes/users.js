"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const userController_1 = require("../controllers/userController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.list));
router.get("/staff", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.listStaff));
router.post("/", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.create));
router.patch("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.update));
router.get("/pending", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.listPending));
router.post("/:id/approve", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.approve));
router.post("/:id/reject", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.reject));
router.post("/:id/disable", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.disable));
router.post("/:id/activate", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.activate));
router.delete("/:id", (0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.remove));
// User dashboard routes
router.get("/dashboard/overview", (0, rbac_1.requireRoles)(roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.getDashboardOverview));
router.put("/profile", (0, rbac_1.requireRoles)(roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.updateProfile));
router.put("/password", (0, rbac_1.requireRoles)(roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.changePassword));
// Alias for wallet endpoint
router.get("/wallet", (0, rbac_1.requireRoles)(roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(async (req, res) => {
    const { WalletController } = await Promise.resolve().then(() => __importStar(require("../controllers/walletController")));
    await WalletController.getMyWallet(req, res);
}));
router.post("/account/delete", (0, rbac_1.requireRoles)(roles_1.ROLES.USER_PERSONAL, roles_1.ROLES.USER_BUSINESS), (0, asyncHandler_1.asyncHandler)(userController_1.UserController.deleteMyAccount));
exports.default = router;
//# sourceMappingURL=users.js.map