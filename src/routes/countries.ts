import { Router } from "express";
import { asyncHandler } from "../middlewares/asyncHandler";
import { CountryController } from "../controllers/countryController";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";

const router = Router();

router.use(authenticate());

router.get("/", asyncHandler(CountryController.list));

router.use(requireRoles(ROLES.SUPER_ADMIN));

router.post("/", asyncHandler(CountryController.create));
router.patch("/:id", asyncHandler(CountryController.update));
router.delete("/:id", asyncHandler(CountryController.remove));

export default router;
