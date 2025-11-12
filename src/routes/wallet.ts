import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { WalletController } from "../controllers/walletController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.get(
  "/me",
  requireRoles(
    ROLES.SUPER_ADMIN,
    ROLES.BRANCH_ADMIN,
    ROLES.USER_PERSONAL,
    ROLES.USER_BUSINESS
  ),
  asyncHandler(WalletController.getMyWallet)
);

router.get(
  "/:userId",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(WalletController.getByUser)
);

export default router;
