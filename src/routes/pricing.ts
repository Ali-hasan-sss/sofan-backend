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
  "/rules",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(PricingController.listRules)
);

router.post(
  "/rules",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(PricingController.createRule)
);

export default router;
