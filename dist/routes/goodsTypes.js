"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const goodsTypeController_1 = require("../controllers/goodsTypeController");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const router = (0, express_1.Router)();
router.get("/public", (0, asyncHandler_1.asyncHandler)(goodsTypeController_1.GoodsTypeController.listPublic));
router.use((0, auth_1.authenticate)());
router.use((0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN, roles_1.ROLES.BRANCH_ADMIN));
router.get("/", (0, asyncHandler_1.asyncHandler)(goodsTypeController_1.GoodsTypeController.list));
router.post("/", (0, asyncHandler_1.asyncHandler)(goodsTypeController_1.GoodsTypeController.create));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(goodsTypeController_1.GoodsTypeController.update));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(goodsTypeController_1.GoodsTypeController.remove));
exports.default = router;
//# sourceMappingURL=goodsTypes.js.map