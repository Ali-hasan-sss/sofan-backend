"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const rbac_1 = require("../middlewares/rbac");
const roles_1 = require("../types/roles");
const shipmentWorkflowController_1 = require("../controllers/shipmentWorkflowController");
const asyncHandler_1 = require("../middlewares/asyncHandler");
const router = (0, express_1.Router)();
router.use((0, auth_1.authenticate)());
// List couriers for authenticated branch (BRANCH_ADMIN, EMPLOYEE)
router.get("/couriers", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.getBranchCouriers));
// List employees for authenticated branch (BRANCH_ADMIN, EMPLOYEE)
router.get("/employees", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.getBranchEmployees));
// List tasks for branch (BRANCH_ADMIN, EMPLOYEE)
router.get("/tasks", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.getBranchTasks));
// Get pending shipments for branch (BRANCH_ADMIN, EMPLOYEE)
router.get("/pending", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.getPendingShipments));
// Approve shipment (BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/approve", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.approveShipment));
// Assign courier (BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/assign-courier", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.assignCourier));
// Create manual task (BRANCH_ADMIN only)
router.post("/:id/tasks", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.createTask));
// Start a task (EMPLOYEE)
router.post("/tasks/:id/start", (0, rbac_1.requireRoles)(roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.startTask));
// Scan pickup (COURIER, BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/scan/pickup", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.scanPickup));
// Scan arrival at branch (BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/scan/arrival", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.scanArrival));
// Scan departure from branch (BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/scan/departure", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.scanDeparture));
// Scan delivery (COURIER, BRANCH_ADMIN, EMPLOYEE)
router.post("/:id/scan/delivery", (0, rbac_1.requireRoles)(roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE), (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.scanDelivery));
// Get tracking history (any authenticated user)
router.get("/:id/tracking", (0, asyncHandler_1.asyncHandler)(shipmentWorkflowController_1.ShipmentWorkflowController.getTracking));
exports.default = router;
//# sourceMappingURL=shipmentWorkflow.js.map