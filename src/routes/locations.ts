import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { LocationController } from "../controllers/locationController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.get(
  "/tree",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(LocationController.hierarchy)
);

router.post(
  "/provinces",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.createProvince)
);

router.patch(
  "/provinces/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.updateProvince)
);

router.delete(
  "/provinces/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.deleteProvince)
);

router.post(
  "/districts",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.createDistrict)
);

router.patch(
  "/districts/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.updateDistrict)
);

router.delete(
  "/districts/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.deleteDistrict)
);

router.post(
  "/villages",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.createVillage)
);

router.patch(
  "/villages/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.updateVillage)
);

router.delete(
  "/villages/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(LocationController.deleteVillage)
);

export default router;
