import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { asyncHandler } from "../middlewares/asyncHandler";
import { AdminController } from "../controllers/adminController";

const router = Router();

router.use(authenticate(), requireRoles(ROLES.SUPER_ADMIN));

router.get("/overview", asyncHandler(AdminController.overview));

export default router;
