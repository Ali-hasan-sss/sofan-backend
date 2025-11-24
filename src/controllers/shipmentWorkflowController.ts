import { Request, Response } from "express";
import { Types } from "mongoose";
import { shipmentWorkflowService } from "../services/shipmentWorkflowService";

export const ShipmentWorkflowController = {
  // List couriers for the authenticated branch
  getBranchCouriers: async (req: Request, res: Response) => {
    const branchId = req.user?.branch?.toString();
    if (!branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const couriers = await shipmentWorkflowService.getCouriersForBranch(
      branchId
    );
    res.json(couriers);
  },

  // List employees for the authenticated branch (for task assignment)
  getBranchEmployees: async (req: Request, res: Response) => {
    const branchId = req.user?.branch?.toString();
    if (!branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const employees = await shipmentWorkflowService.getEmployeesForBranch(
      branchId
    );
    res.json(employees);
  },

  // List tasks for branch staff
  getBranchTasks: async (req: Request, res: Response) => {
    const branchId = req.user?.branch?.toString();
    const userId = req.user?.id;
    if (!branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const { status, myTasks } = req.query;
    const tasks = await shipmentWorkflowService.getTasksForBranch(branchId, {
      status: typeof status === "string" ? status : undefined,
      // If myTasks=true, only show tasks assigned to current user
      employeeId: myTasks === "true" && userId ? userId : undefined,
    });
    res.json(tasks);
  },

  // Get pending shipments for a branch
  getPendingShipments: async (req: Request, res: Response) => {
    const branchId = req.user?.branch?.toString();
    if (!branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const shipments =
      await shipmentWorkflowService.getPendingShipmentsForBranch(branchId);
    res.json(shipments);
  },

  // Approve a shipment
  approveShipment: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;
    const branchId = req.user?.branch?.toString();

    if (!userId || !branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const shipment = await shipmentWorkflowService.approveShipment(
      id,
      userId,
      branchId
    );
    res.json({
      id: shipment.id,
      status: shipment.status,
      message: "Shipment approved successfully",
    });
  },

  // Assign courier to shipment
  assignCourier: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { courierId, targetBranchId, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    if (!courierId) {
      return res.status(400).json({ error: "Courier ID is required" });
    }

    const shipment = await shipmentWorkflowService.assignCourier(
      id,
      courierId,
      userId,
      {
        targetBranchId,
        notes,
      }
    );
    res.json({
      id: shipment.id,
      status: shipment.status,
      assignedCourier: shipment.assignedCourier?.toString(),
      message: "Courier assigned successfully",
    });
  },

  // Create manual task (pickup/transfer/delivery)
  createTask: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { employeeId, courierId, taskType, targetBranchId, notes } = req.body;
    const userId = req.user?.id;
    const branchId = req.user?.branch?.toString();

    if (!userId || !branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    if (!employeeId && !courierId) {
      return res
        .status(400)
        .json({ error: "Either employeeId or courierId is required" });
    }

    const result = await shipmentWorkflowService.createTask(
      id,
      branchId,
      userId,
      {
        employeeId,
        courierId,
        taskType,
        targetBranchId,
        notes,
      }
    );

    const taskId =
      result.task._id instanceof Types.ObjectId
        ? result.task._id.toString()
        : String(result.task._id);

    res.json({
      taskId,
      taskType: result.task.taskType,
      status: result.task.status,
      shipmentStatus: result.shipment.status,
      message: "Task created successfully",
    });
  },

  // Start a task (employee accepts the task)
  startTask: async (req: Request, res: Response) => {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await shipmentWorkflowService.startTask(id, userId);
    const taskId =
      result.task._id instanceof Types.ObjectId
        ? result.task._id.toString()
        : String(result.task._id);
    res.json({
      taskId,
      status: result.task.status,
      message: "Task started successfully",
    });
  },

  // Scan pickup
  scanPickup: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { location, notes } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await shipmentWorkflowService.scanPickup(
      id,
      userId,
      location,
      notes
    );
    res.json({
      id: result.shipment.id,
      status: result.shipment.status,
      scanId: result.scan.id,
      message: "Pickup scanned successfully",
    });
  },

  // Scan arrival at branch
  scanArrival: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { location, notes } = req.body;
    const userId = req.user?.id;
    const branchId = req.user?.branch?.toString();

    if (!userId || !branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const result = await shipmentWorkflowService.scanArrivalAtBranch(
      id,
      branchId,
      userId,
      location,
      notes
    );
    res.json({
      id: result.shipment.id,
      status: result.shipment.status,
      scanId: result.scan.id,
      message: "Arrival scanned successfully",
    });
  },

  // Scan departure from branch
  scanDeparture: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { nextBranchId, courierId, location, notes } = req.body;
    const userId = req.user?.id;
    const branchId = req.user?.branch?.toString();

    if (!userId || !branchId) {
      return res
        .status(403)
        .json({ error: "User must be assigned to a branch" });
    }

    const result = await shipmentWorkflowService.scanDepartureFromBranch(
      id,
      branchId,
      userId,
      nextBranchId,
      courierId,
      location,
      notes
    );
    res.json({
      id: result.shipment.id,
      status: result.shipment.status,
      scanId: result.scan.id,
      message: "Departure scanned successfully",
    });
  },

  // Scan delivery
  scanDelivery: async (req: Request, res: Response) => {
    const { id } = req.params;
    const { location, notes, deliveryProof } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const result = await shipmentWorkflowService.scanDelivery(
      id,
      userId,
      location,
      notes,
      deliveryProof
    );
    res.json({
      id: result.shipment.id,
      status: result.shipment.status,
      scanId: result.scan.id,
      message: "Delivery scanned successfully",
    });
  },

  // Get tracking history
  getTracking: async (req: Request, res: Response) => {
    const { id } = req.params;
    const tracking = await shipmentWorkflowService.getShipmentTracking(id);
    res.json(tracking);
  },
};
