import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { InvoiceController } from "../controllers/invoiceController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

router.get(
  "/",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN, ROLES.USER_BUSINESS, ROLES.USER_PERSONAL),
  asyncHandler(InvoiceController.list)
);

router.get(
  "/:id",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN, ROLES.USER_BUSINESS, ROLES.USER_PERSONAL),
  asyncHandler(InvoiceController.getById)
);

router.post(
  "/",
  requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN),
  asyncHandler(InvoiceController.create)
);

export default router;


