import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { PricingController } from "../controllers/pricingController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.post(
  "/calc",
  requireRoles(
    ROLES.SUPER_ADMIN,
    ROLES.BRANCH_ADMIN,
    ROLES.EMPLOYEE,
    ROLES.USER_PERSONAL,
    ROLES.USER_BUSINESS
  ),
  asyncHandler(PricingController.calculate)
);

router.get(
  "/rates",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(PricingController.listRates)
);

router.post(
  "/rates",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(PricingController.createRate)
);

router.patch(
  "/rates/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(PricingController.updateRate)
);

router.delete(
  "/rates/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(PricingController.removeRate)
);

export default router;
