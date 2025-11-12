import { Router } from "express";
import { AuthController } from "../controllers/authController";
import { asyncHandler } from "../middlewares/asyncHandler";
import { authenticate } from "../middlewares/auth";

const router = Router();

router.get("/me", authenticate(), asyncHandler(AuthController.me));
router.post("/register/email/check", asyncHandler(AuthController.checkEmail));
router.post(
  "/register/email/send-code",
  asyncHandler(AuthController.sendVerificationCode)
);
router.post(
  "/register/email/verify-code",
  asyncHandler(AuthController.verifyVerificationCode)
);
router.post("/register", asyncHandler(AuthController.register));
router.post("/login", asyncHandler(AuthController.login));
router.post("/refresh", asyncHandler(AuthController.refreshToken));
router.post("/logout", authenticate(), asyncHandler(AuthController.logout));

export default router;
