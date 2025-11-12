import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { BranchController } from "../controllers/branchController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.get("/", asyncHandler(BranchController.list));

router.post(
  "/",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(BranchController.create)
);

router.patch(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(BranchController.update)
);

router.delete(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN),
  asyncHandler(BranchController.remove)
);

export default router;
