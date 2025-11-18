import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { UserController } from "../controllers/userController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.get(
  "/",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.list)
);

router.get(
  "/staff",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.listStaff)
);

router.post(
  "/",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.create)
);

router.patch(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.update)
);

router.get(
  "/pending",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(UserController.listPending)
);

router.post(
  "/:id/approve",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(UserController.approve)
);

router.post(
  "/:id/reject",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(UserController.reject)
);

router.post(
  "/:id/disable",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.disable)
);

router.post(
  "/:id/activate",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.activate)
);

router.delete(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(UserController.remove)
);

// User dashboard routes
router.get(
  "/dashboard/overview",
  requireRoles(ROLES.USER_PERSONAL, ROLES.USER_BUSINESS),
  asyncHandler(UserController.getDashboardOverview)
);

router.put(
  "/profile",
  requireRoles(ROLES.USER_PERSONAL, ROLES.USER_BUSINESS),
  asyncHandler(UserController.updateProfile)
);

router.put(
  "/password",
  requireRoles(ROLES.USER_PERSONAL, ROLES.USER_BUSINESS),
  asyncHandler(UserController.changePassword)
);

// Alias for wallet endpoint
router.get(
  "/wallet",
  requireRoles(ROLES.USER_PERSONAL, ROLES.USER_BUSINESS),
  asyncHandler(async (req, res) => {
    const { WalletController } = await import(
      "../controllers/walletController"
    );
    await WalletController.getMyWallet(req, res);
  })
);

router.post(
  "/account/delete",
  requireRoles(ROLES.USER_PERSONAL, ROLES.USER_BUSINESS),
  asyncHandler(UserController.deleteMyAccount)
);

export default router;
