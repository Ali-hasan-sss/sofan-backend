import { Router } from "express";
import { authenticate } from "../middlewares/auth";
import { requireRoles } from "../middlewares/rbac";
import { ROLES } from "../types/roles";
import { ShipmentWorkflowController } from "../controllers/shipmentWorkflowController";
import { asyncHandler } from "../middlewares/asyncHandler";

const router = Router();

router.use(authenticate());

// List couriers for authenticated branch (BRANCH_ADMIN, EMPLOYEE)
router.get(
  "/couriers",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.getBranchCouriers)
);

// List employees for authenticated branch (BRANCH_ADMIN, EMPLOYEE)
router.get(
  "/employees",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.getBranchEmployees)
);

// List tasks for branch (BRANCH_ADMIN, EMPLOYEE)
router.get(
  "/tasks",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.getBranchTasks)
);

// Get pending shipments for branch (BRANCH_ADMIN, EMPLOYEE)
router.get(
  "/pending",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.getPendingShipments)
);

// Approve shipment (BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/approve",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.approveShipment)
);

// Assign courier (BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/assign-courier",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.assignCourier)
);

// Create manual task (BRANCH_ADMIN only)
router.post(
  "/:id/tasks",
  requireRoles(ROLES.BRANCH_ADMIN),
  asyncHandler(ShipmentWorkflowController.createTask)
);

// Start a task (EMPLOYEE)
router.post(
  "/tasks/:id/start",
  requireRoles(ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.startTask)
);

// Scan pickup (COURIER, BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/scan/pickup",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.scanPickup)
);

// Scan arrival at branch (BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/scan/arrival",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.scanArrival)
);

// Scan departure from branch (BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/scan/departure",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.scanDeparture)
);

// Scan delivery (COURIER, BRANCH_ADMIN, EMPLOYEE)
router.post(
  "/:id/scan/delivery",
  requireRoles(ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE),
  asyncHandler(ShipmentWorkflowController.scanDelivery)
);

// Get tracking history (any authenticated user)
router.get(
  "/:id/tracking",
  asyncHandler(ShipmentWorkflowController.getTracking)
);

export default router;
