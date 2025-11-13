import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { asyncHandler } from "../middlewares/asyncHandler";
import { StaffController } from "../controllers/staffController";

const router = Router();

router.use(authenticate());
router.use(requireRoles(ROLES.SUPER_ADMIN));

router.get("/", asyncHandler(StaffController.list));
router.post("/", asyncHandler(StaffController.create));
router.patch("/:id", asyncHandler(StaffController.update));
router.delete("/:id", asyncHandler(StaffController.remove));

export default router;
