import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { asyncHandler } from "../middlewares/asyncHandler";
import { SettingsController } from "../controllers/settingsController";

const router = Router();

router.use(authenticate());

router.get("/", asyncHandler(SettingsController.get));

router.patch(
  "/",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(SettingsController.update)
);

export default router;
