import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { GoodsTypeController } from "../controllers/goodsTypeController";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";

const router = Router();

router.get("/public", asyncHandler(GoodsTypeController.listPublic));

router.use(authenticate());
router.use(requireRoles(ROLES.SUPER_ADMIN, ROLES.BRANCH_ADMIN));

router.get("/", asyncHandler(GoodsTypeController.list));
router.post("/", asyncHandler(GoodsTypeController.create));
router.patch("/:id", asyncHandler(GoodsTypeController.update));
router.delete("/:id", asyncHandler(GoodsTypeController.remove));

export default router;
