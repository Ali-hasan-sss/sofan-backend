"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const countryController_1 = require("../controllers/countryController");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
router.get("/", (0, asyncHandler_1.asyncHandler)(countryController_1.CountryController.list));
router.use((0, rbac_1.requireRoles)(roles_1.ROLES.SUPER_ADMIN));
router.post("/", (0, asyncHandler_1.asyncHandler)(countryController_1.CountryController.create));
router.patch("/:id", (0, asyncHandler_1.asyncHandler)(countryController_1.CountryController.update));
router.delete("/:id", (0, asyncHandler_1.asyncHandler)(countryController_1.CountryController.remove));
exports.default = router;
//# sourceMappingURL=countries.js.map