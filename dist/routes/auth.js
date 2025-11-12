"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const auth_1 = require("../middlewares/auth");
const router = (0, express_1.Router)();
router.get("/me", (0, auth_1.authenticate)(), (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.me));
router.post("/register/email/check", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.checkEmail));
router.post("/register/email/send-code", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.sendVerificationCode));
router.post("/register/email/verify-code", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.verifyVerificationCode));
router.post("/register", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.register));
router.post("/login", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.login));
router.post("/refresh", (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.refreshToken));
router.post("/logout", (0, auth_1.authenticate)(), (0, asyncHandler_1.asyncHandler)(authController_1.AuthController.logout));
exports.default = router;
//# sourceMappingURL=auth.js.map