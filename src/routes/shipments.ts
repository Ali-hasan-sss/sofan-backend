import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { ShipmentController } from "../controllers/shipmentController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.get("/track/:number", asyncHandler(ShipmentController.trackPublic));

router.use(authenticate());

router.get(
  "/",
  requireRoles(
    ROLES.SUPER_ADMIN,
    ROLES.BRANCH_ADMIN,
    ROLES.EMPLOYEE,
    ROLES.USER_PERSONAL,
    ROLES.USER_BUSINESS
  ),
  asyncHandler(ShipmentController.list)
);

router.post(
  "/",
  requireRoles(
    ROLES.SUPER_ADMIN,
    ROLES.BRANCH_ADMIN,
    ROLES.EMPLOYEE,
    ROLES.USER_PERSONAL,
    ROLES.USER_BUSINESS
  ),
  asyncHandler(ShipmentController.create)
);

router.get(
  "/:id",
  requireRoles(
    ROLES.SUPER_ADMIN,
    ROLES.BRANCH_ADMIN,
    ROLES.EMPLOYEE,
    ROLES.USER_PERSONAL,
    ROLES.USER_BUSINESS
  ),
  asyncHandler(ShipmentController.getById)
);

router.patch(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentController.update)
);

router.delete(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(ShipmentController.remove)
);

export default router;
