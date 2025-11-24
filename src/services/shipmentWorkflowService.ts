import { ShipmentModel } from "../models/Shipment";
import { CourierModel } from "../models/Courier";
import { BranchModel } from "../models/Branch";
import { ScanModel } from "../models/Scan";
import { ShipmentTrackingModel } from "../models/ShipmentTracking";
import { UserModel } from "../models/User";
import { DistrictModel } from "../models/District";
import { ShipmentTaskModel } from "../models/ShipmentTask";
import { walletService } from "./walletService";
import mongoose, { Types, type FilterQuery } from "mongoose";
import type { ShipmentTaskDocument } from "../models/ShipmentTask";

const toObjectId = (value?: unknown): Types.ObjectId | undefined => {
  if (!value) {
    return undefined;
  }
  if (value instanceof Types.ObjectId) {
    return value;
  }
  if (typeof value === "string") {
    return new Types.ObjectId(value);
  }
  return undefined;
};

export const shipmentWorkflowService = {
  /**
   * Find the branch responsible for a sender's location
   */
  findBranchForSender: async (
    districtId?: string,
    provinceId?: string
  ): Promise<string | null> => {
    if (districtId) {
      const district = await DistrictModel.findById(districtId).lean();
      if (district?.branch) {
        return district.branch.toString();
      }
    }
    // If no branch found for district, you might want to implement province-level lookup
    // For now, return null and let the caller handle it
    return null;
  },

  /**
   * Approve a shipment by branch admin
   */
  approveShipment: async (
    shipmentId: string,
    approvedBy: string,
    branchId: string
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (shipment.status !== "pending_approval") {
      const error = new Error("Shipment is not pending approval");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    // Verify the branch matches
    if (shipment.branchFrom?.toString() !== branchId) {
      const error = new Error("Shipment does not belong to this branch");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    shipment.status = "approved";
    shipment.currentBranch = shipment.branchFrom;
    shipment.approvals.push({
      approvedBy: new mongoose.Types.ObjectId(approvedBy),
      approvedAt: new Date(),
    });

    await shipment.save();

    // Get branch name for tracking message
    const branch = await BranchModel.findById(branchId).lean();
    const branchName = branch?.name || "الفرع";

    // Create tracking event
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "approved",
      branch: shipment.branchFrom,
      scannedBy: new mongoose.Types.ObjectId(approvedBy),
      notes: `تم استلام طلب الشحنة من فرع ${branchName}`,
    });

    return shipment;
  },

  /**
   * Assign a courier to a shipment
   */
  assignCourier: async (
    shipmentId: string,
    courierId: string,
    assignedBy: string,
    options?: { targetBranchId?: string; notes?: string }
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (shipment.status !== "approved") {
      const error = new Error(
        "Shipment must be approved before assigning courier"
      );
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    const courier = await CourierModel.findById(courierId);
    if (!courier) {
      const error = new Error("Courier not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (!courier.isActive) {
      const error = new Error("Courier is not active");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    if (!shipment.branchFrom) {
      const error = new Error("Shipment does not have an origin branch");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    const destinationBranchId =
      options?.targetBranchId || shipment.branchFrom.toString();
    const destinationBranch = await BranchModel.findById(destinationBranchId);
    if (!destinationBranch) {
      const error = new Error("Destination branch not found for the task");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    shipment.status = "courier_assigned";
    shipment.assignedCourier = new mongoose.Types.ObjectId(courierId);

    await shipment.save();

    // Get assigned by user name for tracking message
    const assignedByUser = await UserModel.findById(assignedBy).lean();
    const employeeName = assignedByUser
      ? `${assignedByUser.firstName} ${assignedByUser.lastName}`
      : "الموظف";
    const courierName = `${courier.firstName} ${courier.lastName}`;

    const task = await ShipmentTaskModel.create({
      shipment: shipment._id,
      taskType: "pickup",
      courier: courier._id,
      createdBy: new mongoose.Types.ObjectId(assignedBy),
      branchFrom: shipment.branchFrom,
      branchTo: destinationBranch._id,
      notes: options?.notes,
      status: "pending",
    });

    // Create tracking event
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "courier_assigned",
      branch: shipment.currentBranch,
      courier: new mongoose.Types.ObjectId(courierId),
      scannedBy: new mongoose.Types.ObjectId(assignedBy),
      notes: `تم إنشاء مهمة للمندوب ${courierName} من قبل ${employeeName} ليستلم الشحنة من المرسل ويتجه بها إلى فرع ${destinationBranch.name}`,
      metadata: {
        taskId: task._id,
        destinationBranch: {
          id: destinationBranch._id,
          name: destinationBranch.name,
          code: destinationBranch.code,
        },
      },
    });

    return shipment;
  },

  /**
   * List active couriers for a branch
   */
  getCouriersForBranch: async (branchId: string) => {
    const branchObjectId = new mongoose.Types.ObjectId(branchId);

    const couriers = await CourierModel.find({
      branch: branchObjectId,
      isActive: true,
    })
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    const couriersById = new Map<string, (typeof couriers)[number]>();
    const couriersByPhone = new Map<string, (typeof couriers)[number]>();

    for (const courier of couriers) {
      couriersById.set(courier._id.toString(), courier);
      if (courier.phone) {
        couriersByPhone.set(courier.phone, courier);
      }
    }

    // Ensure every active branch employee can act as a courier
    const staffMembers = await UserModel.find({
      branch: branchObjectId,
      role: { $in: ["BRANCH_ADMIN", "EMPLOYEE"] },
      isActive: true,
      status: "approved",
    })
      .select("firstName lastName phone email branch")
      .lean();

    for (const staff of staffMembers) {
      if (!staff.phone) {
        continue;
      }

      let courier = couriersByPhone.get(staff.phone);
      if (!courier) {
        const createdCourier = await CourierModel.create({
          firstName: staff.firstName,
          lastName: staff.lastName,
          phone: staff.phone,
          email: staff.email,
          branch: branchObjectId,
          isActive: true,
        });
        const newCourier =
          createdCourier.toObject() as (typeof couriers)[number];
        courier = newCourier;
        couriersByPhone.set(staff.phone, newCourier);
        if (newCourier._id) {
          couriersById.set(newCourier._id.toString(), newCourier);
        }
        couriers.push(newCourier);
      }
    }

    return couriers.map((courier) => ({
      id: courier._id.toString(),
      firstName: courier.firstName,
      lastName: courier.lastName,
      phone: courier.phone,
      vehicleType: courier.vehicleType,
    }));
  },

  /**
   * List active employees for a branch (for task assignment)
   */
  getEmployeesForBranch: async (branchId: string) => {
    const branchObjectId = new mongoose.Types.ObjectId(branchId);

    const employees = await UserModel.find({
      branch: branchObjectId,
      role: { $in: ["BRANCH_ADMIN", "EMPLOYEE"] },
      isActive: true,
      status: "approved",
    })
      .select("firstName lastName phone email")
      .sort({ firstName: 1, lastName: 1 })
      .lean();

    return employees.map((employee) => ({
      id: employee._id.toString(),
      firstName: employee.firstName,
      lastName: employee.lastName,
      phone: employee.phone,
      email: employee.email,
    }));
  },

  /**
   * List tasks for a branch (branch staff visibility)
   */
  getTasksForBranch: async (
    branchId: string,
    params?: { status?: string; employeeId?: string }
  ) => {
    const query: FilterQuery<ShipmentTaskDocument> = {
      $or: [{ branchFrom: branchId }, { branchTo: branchId }],
    };

    if (params?.status) {
      query.status = params.status as ShipmentTaskDocument["status"];
    }

    // If employeeId is provided, filter by assigned employee
    if (params?.employeeId) {
      query.employee = new mongoose.Types.ObjectId(params.employeeId);
    }

    const tasks = await ShipmentTaskModel.find(query)
      .populate("shipment", "shipmentNumber status sender recipient")
      .populate("employee", "firstName lastName phone")
      .populate("courier", "firstName lastName phone")
      .populate("branchFrom", "name code")
      .populate("branchTo", "name code")
      .sort({ createdAt: -1 })
      .lean();

    return tasks.map((task) => {
      // Use employee if available, otherwise fall back to courier
      const assignedPerson = (task as any).employee || (task as any).courier;
      return {
        id: task._id.toString(),
        taskType: task.taskType,
        status: task.status,
        courier: assignedPerson
          ? {
              id: assignedPerson._id?.toString(),
              firstName: assignedPerson.firstName,
              lastName: assignedPerson.lastName,
              phone: assignedPerson.phone,
            }
          : undefined,
        shipment: task.shipment
          ? {
              id: task.shipment._id?.toString(),
              shipmentNumber: (task.shipment as any).shipmentNumber,
              status: (task.shipment as any).status,
              senderName: (task.shipment as any).sender?.name,
              recipientName: (task.shipment as any).recipient?.name,
            }
          : undefined,
        branchFrom: task.branchFrom
          ? {
              id: task.branchFrom._id?.toString(),
              name: (task.branchFrom as any).name,
              code: (task.branchFrom as any).code,
            }
          : undefined,
        branchTo: task.branchTo
          ? {
              id: task.branchTo._id?.toString(),
              name: (task.branchTo as any).name,
              code: (task.branchTo as any).code,
            }
          : undefined,
        notes: task.notes,
        createdAt: task.createdAt,
        startedAt: task.startedAt,
        completedAt: task.completedAt,
      };
    });
  },

  /**
   * Manually create a shipment task (pickup/transfer/delivery) by branch staff
   */
  createTask: async (
    shipmentId: string,
    branchId: string,
    createdBy: string,
    params: {
      employeeId?: string;
      courierId?: string;
      taskType?: "pickup" | "transfer" | "delivery";
      targetBranchId?: string;
      notes?: string;
    }
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const allowedBranches = [
      shipment.branchFrom?.toString(),
      shipment.currentBranch?.toString(),
    ].filter(Boolean);

    if (!allowedBranches.includes(branchId)) {
      const error = new Error(
        "Branch is not authorized to create a task for this shipment"
      );
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    let employee;
    let employeeObjectId: Types.ObjectId | undefined;
    let courierObjectId: Types.ObjectId | undefined;

    // If employeeId is provided, use employee directly
    if (params.employeeId) {
      employee = await UserModel.findById(params.employeeId);
      if (!employee || !employee.isActive || employee.status !== "approved") {
        const error = new Error("Employee is not available");
        (error as Error & { status?: number }).status = 400;
        throw error;
      }

      // Check if employee belongs to the same branch
      if (employee.branch?.toString() !== branchId) {
        const error = new Error("Employee does not belong to this branch");
        (error as Error & { status?: number }).status = 403;
        throw error;
      }

      employeeObjectId = toObjectId(employee._id);
      if (!employeeObjectId) {
        const error = new Error("Invalid employee identifier");
        (error as Error & { status?: number }).status = 500;
        throw error;
      }
    } else if (params.courierId) {
      // Legacy support: if courierId is provided, find corresponding employee or use courier
      const courier = await CourierModel.findById(params.courierId);
      if (!courier || !courier.isActive) {
        const error = new Error("Courier is not available");
        (error as Error & { status?: number }).status = 400;
        throw error;
      }
      courierObjectId = toObjectId(courier._id);

      // Try to find employee by phone
      if (courier.phone) {
        const foundEmployee = await UserModel.findOne({
          phone: courier.phone,
          branch: new mongoose.Types.ObjectId(branchId),
          isActive: true,
          status: "approved",
        });
        if (foundEmployee) {
          employee = foundEmployee;
          employeeObjectId = toObjectId(foundEmployee._id);
        }
      }
    } else {
      const error = new Error("Either employeeId or courierId is required");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    if (!employeeObjectId && !courierObjectId) {
      const error = new Error("Invalid employee or courier identifier");
      (error as Error & { status?: number }).status = 500;
      throw error;
    }

    const taskType = params.taskType ?? "pickup";
    const branchFromObjectId = new mongoose.Types.ObjectId(branchId);
    const branchToObjectId =
      params.targetBranchId &&
      mongoose.Types.ObjectId.isValid(params.targetBranchId)
        ? new mongoose.Types.ObjectId(params.targetBranchId)
        : shipment.branchFrom ?? branchFromObjectId;

    const task = await ShipmentTaskModel.create({
      shipment: shipment._id,
      taskType,
      employee: employeeObjectId!,
      courier: courierObjectId,
      createdBy: new mongoose.Types.ObjectId(createdBy),
      branchFrom: branchFromObjectId,
      branchTo: branchToObjectId,
      notes: params.notes,
      status: "pending",
    });

    if (taskType === "pickup") {
      // Use employee or courier for assignedCourier
      shipment.assignedCourier = employeeObjectId || courierObjectId;
      if (shipment.status === "approved") {
        shipment.status = "courier_assigned";
      }
      await shipment.save();
    } else if (taskType === "transfer") {
      // For transfer tasks, ensure currentBranch is set to the branch where the task is created
      if (
        !shipment.currentBranch ||
        shipment.currentBranch.toString() !== branchId
      ) {
        shipment.currentBranch = branchFromObjectId;
      }
      await shipment.save();
    }

    const branchFrom = await BranchModel.findById(branchFromObjectId).lean();
    const branchTo = await BranchModel.findById(branchToObjectId).lean();
    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName}`
      : courierObjectId
      ? "Unknown"
      : "Unknown";

    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "task_created",
      branch: branchFromObjectId,
      courier: employeeObjectId || courierObjectId,
      scannedBy: new mongoose.Types.ObjectId(createdBy),
      notes: `تم إنشاء مهمة جديدة للموظف ${employeeName} من فرع ${
        branchFrom?.name || ""
      } متجهة إلى فرع ${branchTo?.name || ""}`,
      metadata: {
        taskId: task._id,
        taskType,
        targetBranch: branchTo
          ? { id: branchTo._id, name: branchTo.name, code: branchTo.code }
          : undefined,
      },
    });

    return { shipment, task };
  },

  /**
   * Start a task (employee accepts the task)
   */
  startTask: async (taskId: string, userId: string) => {
    const task = await ShipmentTaskModel.findById(taskId);
    if (!task) {
      const error = new Error("Task not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    // Check if user is the assigned employee
    const userObjectId = new mongoose.Types.ObjectId(userId);
    if (
      task.employee.toString() !== userId &&
      task.courier?.toString() !== userId
    ) {
      const error = new Error("You are not assigned to this task");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    if (task.status !== "pending") {
      const error = new Error(
        `Task is already ${task.status}. Only pending tasks can be started.`
      );
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    task.status = "in_progress";
    task.startedAt = new Date();
    await task.save();

    // Get employee info for tracking
    const employee = await UserModel.findById(task.employee).lean();
    const employeeName = employee
      ? `${employee.firstName} ${employee.lastName}`
      : "الموظف";

    // Create tracking event
    await ShipmentTrackingModel.create({
      shipment: task.shipment,
      eventType: "task_created",
      branch: task.branchFrom,
      courier: task.employee,
      scannedBy: userObjectId,
      notes: `تم استلام المهمة من قبل الموظف ${employeeName}`,
      metadata: {
        taskId: task._id,
        taskType: task.taskType,
      },
    });

    return { task };
  },

  /**
   * Scan shipment - pickup by courier or branch
   */
  scanPickup: async (
    shipmentId: string,
    scannedBy: string,
    location?: { latitude?: number; longitude?: number; address?: string },
    notes?: string
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (shipment.status !== "courier_assigned") {
      const error = new Error(
        "Shipment must have courier assigned before pickup"
      );
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    shipment.status = "picked_up";

    await shipment.save();

    // Resolve pickup task (if any) to capture destination branch
    const pickupTask = await ShipmentTaskModel.findOne({
      shipment: shipment._id,
      taskType: "pickup",
      $or: [
        { employee: shipment.assignedCourier },
        { courier: shipment.assignedCourier },
      ],
      status: "in_progress", // Only complete tasks that are in progress
    }).sort({ createdAt: -1 });

    let destinationBranchId: string | undefined;
    if (pickupTask) {
      destinationBranchId = pickupTask.branchTo?.toString();
      pickupTask.status = "completed";
      pickupTask.completedAt = new Date();
      await pickupTask.save();
    }

    const destinationBranchLookupId =
      destinationBranchId ||
      shipment.branchFrom?.toString() ||
      shipment.currentBranch?.toString();
    const destinationBranch = destinationBranchLookupId
      ? await BranchModel.findById(destinationBranchLookupId).lean()
      : null;

    const courier = await CourierModel.findById(
      shipment.assignedCourier
    ).lean();
    const courierName = courier
      ? `${courier.firstName} ${courier.lastName}`
      : "المندوب";
    const destinationBranchName = destinationBranch?.name || "الفرع";
    const trackingNote = `تم استلام الشحنة من قبل المندوب ${courierName} وهي في الطريق إلى فرع ${destinationBranchName}`;

    // Create scan record
    const scan = await ScanModel.create({
      shipment: shipment._id,
      scanType: "pickup",
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      branch: shipment.currentBranch,
      courier: shipment.assignedCourier,
      location,
      notes,
    });

    // Create tracking event
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "picked_up",
      branch: shipment.currentBranch,
      courier: shipment.assignedCourier,
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      notes: trackingNote,
      metadata: {
        location,
        destinationBranch: destinationBranch
          ? {
              id: destinationBranch._id,
              name: destinationBranch.name,
              code: destinationBranch.code,
            }
          : undefined,
      },
    });

    return { shipment, scan };
  },

  /**
   * Scan shipment - arrival at branch
   */
  scanArrivalAtBranch: async (
    shipmentId: string,
    branchId: string,
    scannedBy: string,
    location?: { latitude?: number; longitude?: number; address?: string },
    notes?: string
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const branch = await BranchModel.findById(branchId);
    if (!branch) {
      const error = new Error("Branch not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    // Determine status based on which branch
    let newStatus: string;
    if (branchId === shipment.branchFrom?.toString()) {
      newStatus = "at_origin_branch";
    } else if (branchId === shipment.branchTo?.toString()) {
      newStatus = "at_destination_branch";
    } else {
      newStatus = "at_transit_branch";
    }

    shipment.status = newStatus as any;
    shipment.currentBranch = new mongoose.Types.ObjectId(branchId);

    await shipment.save();

    const arrivalTask = await ShipmentTaskModel.findOne({
      shipment: shipment._id,
      branchTo: branch._id,
      status: { $ne: "completed" },
    }).sort({ createdAt: -1 });

    let previousBranchName: string | undefined;
    if (arrivalTask) {
      arrivalTask.status = "completed";
      arrivalTask.completedAt = new Date();
      arrivalTask.startedAt = arrivalTask.startedAt ?? new Date();
      await arrivalTask.save();

      if (arrivalTask.branchFrom) {
        const previousBranch = await BranchModel.findById(
          arrivalTask.branchFrom
        ).lean();
        previousBranchName = previousBranch?.name;
      }
    }

    // Create scan record
    const scan = await ScanModel.create({
      shipment: shipment._id,
      scanType: "arrival_at_branch",
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      branch: new mongoose.Types.ObjectId(branchId),
      courier: shipment.assignedCourier,
      location,
      notes,
    });

    // Create tracking event with Arabic message
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "arrived_at_branch",
      branch: new mongoose.Types.ObjectId(branchId),
      courier: shipment.assignedCourier,
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      notes: `تم وصول الشحنة إلى فرع ${branch.name}`,
      metadata: {
        location,
        fromBranch:
          arrivalTask?.branchFrom && previousBranchName
            ? {
                name: previousBranchName,
                id: arrivalTask.branchFrom,
              }
            : undefined,
      },
    });

    return { shipment, scan };
  },

  /**
   * Scan shipment - departure from branch
   */
  scanDepartureFromBranch: async (
    shipmentId: string,
    branchId: string,
    scannedBy: string,
    nextBranchId?: string,
    courierId?: string,
    location?: { latitude?: number; longitude?: number; address?: string },
    notes?: string
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    // Check if shipment is at this branch
    // If currentBranch is not set, check if branchFrom matches (for initial transfer tasks)
    const isAtBranch =
      shipment.currentBranch?.toString() === branchId ||
      (!shipment.currentBranch && shipment.branchFrom?.toString() === branchId);

    if (!isAtBranch) {
      const error = new Error("Shipment is not at this branch");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    // If currentBranch is not set, set it now
    if (!shipment.currentBranch) {
      shipment.currentBranch = new mongoose.Types.ObjectId(branchId);
    }

    const departingBranch = await BranchModel.findById(branchId).lean();
    if (!departingBranch) {
      const error = new Error("Branch not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    let nextBranch = null;
    if (nextBranchId) {
      nextBranch = await BranchModel.findById(nextBranchId).lean();
      if (!nextBranch) {
        const error = new Error("Next branch not found");
        (error as Error & { status?: number }).status = 404;
        throw error;
      }
    }

    const resolvedCourierId = courierId || shipment.assignedCourier?.toString();
    if (!resolvedCourierId) {
      const error = new Error("Courier must be specified for departure");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    const resolvedCourierObjectId = new mongoose.Types.ObjectId(
      resolvedCourierId
    );

    if (courierId || !shipment.assignedCourier) {
      shipment.assignedCourier = resolvedCourierObjectId;
    }

    // Find employee for the task - try to find employee by courier ID or use scannedBy
    let employeeObjectId: Types.ObjectId | undefined;

    // First, try to find employee by courier ID (if courier has matching phone)
    const courier = await CourierModel.findById(resolvedCourierId).lean();
    if (courier?.phone) {
      const foundEmployee = await UserModel.findOne({
        phone: courier.phone,
        branch: new mongoose.Types.ObjectId(branchId),
        isActive: true,
        status: "approved",
      }).lean();
      if (foundEmployee && foundEmployee._id) {
        employeeObjectId = toObjectId(
          foundEmployee._id instanceof Types.ObjectId
            ? foundEmployee._id
            : String(foundEmployee._id)
        );
      }
    }

    // If no employee found by phone, try to use scannedBy as employee
    if (!employeeObjectId) {
      const scannedByUser = await UserModel.findById(scannedBy).lean();
      if (
        scannedByUser &&
        scannedByUser.branch?.toString() === branchId &&
        scannedByUser._id
      ) {
        employeeObjectId = toObjectId(
          scannedByUser._id instanceof Types.ObjectId
            ? scannedByUser._id
            : String(scannedByUser._id)
        );
      }
    }

    // If still no employee, use courier ID as employee (for backward compatibility)
    if (!employeeObjectId) {
      employeeObjectId = resolvedCourierObjectId;
    }

    const courierName = courier
      ? `${courier.firstName} ${courier.lastName}`
      : "المندوب";

    // If there's a next branch, assign courier and set to in_transit
    if (nextBranchId) {
      shipment.status = "in_transit";
    } else if (branchId === shipment.branchTo?.toString()) {
      // If leaving destination branch, it's out for delivery
      shipment.status = "out_for_delivery";
    } else {
      shipment.status = "in_transit";
    }

    const currentBranchObjectId = toObjectId(shipment.currentBranch);
    shipment.currentBranch = undefined;

    await shipment.save();

    // Ensure employeeObjectId is set before creating tasks
    if (!employeeObjectId) {
      const error = new Error("Employee must be specified for task creation");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    let createdTaskId: mongoose.Types.ObjectId | undefined;
    if (nextBranchId && nextBranch) {
      const task = await ShipmentTaskModel.create({
        shipment: shipment._id,
        taskType: "transfer",
        employee: employeeObjectId,
        courier: resolvedCourierObjectId,
        createdBy: new mongoose.Types.ObjectId(scannedBy),
        branchFrom: currentBranchObjectId,
        branchTo: new mongoose.Types.ObjectId(nextBranchId),
        status: "in_progress",
        startedAt: new Date(),
        notes,
      });
      createdTaskId = task._id as mongoose.Types.ObjectId;
    } else if (branchId === shipment.branchTo?.toString()) {
      const deliveryBranchId =
        toObjectId(shipment.branchTo) ?? new Types.ObjectId(branchId);
      const task = await ShipmentTaskModel.create({
        shipment: shipment._id,
        taskType: "delivery",
        employee: employeeObjectId,
        courier: resolvedCourierObjectId,
        createdBy: new mongoose.Types.ObjectId(scannedBy),
        branchFrom: currentBranchObjectId,
        branchTo: deliveryBranchId,
        status: "in_progress",
        startedAt: new Date(),
        notes,
      });
      createdTaskId = task._id as mongoose.Types.ObjectId;
    }

    // Create scan record
    const scan = await ScanModel.create({
      shipment: shipment._id,
      scanType: "departure_from_branch",
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      branch: new mongoose.Types.ObjectId(branchId),
      courier: resolvedCourierObjectId,
      location,
      notes,
    });

    const departingBranchName = departingBranch.name || "الفرع";
    let trackingNote: string;
    if (nextBranch) {
      trackingNote = `غادرت الشحنة فرع ${departingBranchName} برفقة المندوب ${courierName} متجهة إلى فرع ${nextBranch.name}`;
    } else if (branchId === shipment.branchTo?.toString()) {
      trackingNote = `تم إرسال الشحنة للتسليم النهائي من فرع ${departingBranchName} برفقة المندوب ${courierName}`;
    } else {
      trackingNote = `غادرت الشحنة فرع ${departingBranchName} برفقة المندوب ${courierName}`;
    }

    // Create tracking event
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "departed_from_branch",
      branch: new mongoose.Types.ObjectId(branchId),
      courier: resolvedCourierObjectId,
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      notes: notes || trackingNote,
      metadata: {
        nextBranch: nextBranch
          ? {
              id: nextBranch._id,
              name: nextBranch.name,
              code: nextBranch.code,
            }
          : undefined,
        location,
        taskId: createdTaskId,
      },
    });

    return { shipment, scan };
  },

  /**
   * Scan shipment - delivery to recipient
   */
  scanDelivery: async (
    shipmentId: string,
    scannedBy: string,
    location?: { latitude?: number; longitude?: number; address?: string },
    notes?: string,
    deliveryProof?: {
      identityFrontImage?: string;
      identityBackImage?: string;
      signature?: string;
      codCollected?: number;
      codCurrency?: string;
    }
  ) => {
    const shipment = await ShipmentModel.findById(shipmentId);
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (shipment.status !== "out_for_delivery") {
      const error = new Error("Shipment must be out for delivery");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    // Validate delivery proof if COD shipment
    if (shipment.paymentMethod === "cod") {
      if (
        !deliveryProof?.identityFrontImage ||
        !deliveryProof?.identityBackImage
      ) {
        const error = new Error(
          "Identity images are required for COD delivery"
        );
        (error as Error & { status?: number }).status = 400;
        throw error;
      }
      if (!deliveryProof?.signature) {
        const error = new Error("Signature is required for delivery");
        (error as Error & { status?: number }).status = 400;
        throw error;
      }
    }

    // Update shipment status
    shipment.status = "delivered";

    // Save delivery proof
    if (deliveryProof) {
      shipment.deliveryProof = {
        identityFrontImage: deliveryProof.identityFrontImage,
        identityBackImage: deliveryProof.identityBackImage,
        signature: deliveryProof.signature,
        deliveredAt: new Date(),
        deliveredBy: new mongoose.Types.ObjectId(scannedBy),
        codCollected: deliveryProof.codCollected,
        codCurrency:
          deliveryProof.codCurrency ||
          shipment.codCurrency ||
          shipment.pricing.currency,
      };
    }

    await shipment.save();

    const deliveryTask = await ShipmentTaskModel.findOne({
      shipment: shipment._id,
      taskType: "delivery",
      status: { $ne: "completed" },
    }).sort({ createdAt: -1 });

    if (deliveryTask) {
      deliveryTask.status = "completed";
      deliveryTask.completedAt = new Date();
      deliveryTask.startedAt = deliveryTask.startedAt ?? new Date();
      await deliveryTask.save();
    }

    // Handle COD - add to courier/employee wallet
    if (
      shipment.paymentMethod === "cod" &&
      deliveryProof?.codCollected &&
      deliveryProof.codCollected > 0
    ) {
      // Find the user who delivered (could be employee or courier)
      const deliveredByUser = await UserModel.findById(scannedBy).lean();
      if (deliveredByUser) {
        const codAmount = deliveryProof.codCollected;
        const codCurrency =
          deliveryProof.codCurrency ||
          shipment.codCurrency ||
          shipment.pricing.currency;

        await walletService.addCredit(
          String(deliveredByUser._id),
          codAmount,
          codCurrency,
          `COD_COLLECTION_${shipment.shipmentNumber}`,
          {
            shipmentId: String(shipment._id),
            shipmentNumber: shipment.shipmentNumber,
            codAmount: codAmount,
            codCurrency: codCurrency,
            deliveredAt: new Date(),
          }
        );
      } else {
        // If scannedBy is not a User, try to find courier's user account
        const courier = await CourierModel.findById(
          shipment.assignedCourier
        ).lean();
        if (courier?.phone) {
          const courierUser = await UserModel.findOne({
            phone: courier.phone,
            isActive: true,
            status: "approved",
          }).lean();
          if (courierUser) {
            const codAmount = deliveryProof.codCollected;
            const codCurrency =
              deliveryProof.codCurrency ||
              shipment.codCurrency ||
              shipment.pricing.currency;

            await walletService.addCredit(
              String(courierUser._id),
              codAmount,
              codCurrency,
              `COD_COLLECTION_${shipment.shipmentNumber}`,
              {
                shipmentId: String(shipment._id),
                shipmentNumber: shipment.shipmentNumber,
                codAmount: codAmount,
                codCurrency: codCurrency,
                deliveredAt: new Date(),
              }
            );
          }
        }
      }
    }

    // Get courier name for tracking message
    const courier = await CourierModel.findById(
      shipment.assignedCourier
    ).lean();
    const courierName = courier
      ? `${courier.firstName} ${courier.lastName}`
      : "المندوب";
    const recipientName = shipment.recipient?.name || "العميل";

    // Create scan record
    const scan = await ScanModel.create({
      shipment: shipment._id,
      scanType: "delivery",
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      branch: shipment.branchTo,
      courier: shipment.assignedCourier,
      location,
      notes,
    });

    // Create tracking event with Arabic message
    await ShipmentTrackingModel.create({
      shipment: shipment._id,
      eventType: "delivered",
      branch: shipment.branchTo,
      courier: shipment.assignedCourier,
      scannedBy: new mongoose.Types.ObjectId(scannedBy),
      notes: `تم تسليم الشحنة إلى المرسل إليه ${recipientName} من قبل المندوب ${courierName}`,
      metadata: {
        location,
        taskId: deliveryTask?._id,
        deliveryProof: deliveryProof
          ? {
              hasIdentityImages:
                !!deliveryProof.identityFrontImage &&
                !!deliveryProof.identityBackImage,
              hasSignature: !!deliveryProof.signature,
              codCollected: deliveryProof.codCollected,
            }
          : undefined,
      },
    });

    return { shipment, scan };
  },

  /**
   * Get shipments pending approval for a branch
   */
  getPendingShipmentsForBranch: async (branchId: string) => {
    const shipments = await ShipmentModel.find({
      branchFrom: branchId,
      status: "pending_approval",
    })
      .populate("createdBy", "firstName lastName email phone")
      .populate("sender.province", "name")
      .populate("sender.district", "name")
      .populate("sender.village", "name")
      .sort({ createdAt: -1 })
      .lean();

    return shipments.map((shipment) => ({
      id: shipment._id.toString(),
      shipmentNumber: shipment.shipmentNumber,
      status: shipment.status,
      sender: shipment.sender,
      recipient: shipment.recipient,
      packagesCount: shipment.packages.reduce(
        (acc, pkg) => acc + (pkg.quantity ?? 1),
        0
      ),
      pricing: shipment.pricing,
      createdAt: shipment.createdAt,
      createdBy: shipment.createdBy,
    }));
  },

  /**
   * Get tracking history for a shipment
   */
  getShipmentTracking: async (shipmentId: string) => {
    const tracking = await ShipmentTrackingModel.find({
      shipment: shipmentId,
    })
      .populate("branch", "name code")
      .populate("courier", "firstName lastName phone")
      .populate("scannedBy", "firstName lastName email")
      .sort({ createdAt: -1 })
      .lean();

    return tracking.map((event) => ({
      id: event._id.toString(),
      eventType: event.eventType,
      branch: event.branch,
      courier: event.courier,
      scannedBy: event.scannedBy,
      notes: event.notes,
      metadata: event.metadata,
      createdAt: event.createdAt,
    }));
  },
};
