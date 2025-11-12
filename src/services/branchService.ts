import {
  branchCreateSchema,
  branchUpdateSchema,
} from "../validators/branchSchemas";
import { BranchModel } from "../models/Branch";
import { UserModel } from "../models/User";
import { ROLES } from "../types/roles";
import { HydratedDocument } from "mongoose";
import type { UserDocument } from "../models/User";

type AllowedManagerRole = typeof ROLES.BRANCH_ADMIN | typeof ROLES.EMPLOYEE;
const ALLOWED_MANAGER_ROLES: AllowedManagerRole[] = [
  ROLES.BRANCH_ADMIN,
  ROLES.EMPLOYEE,
];

const extractId = (value: unknown): string | undefined => {
  if (!value) return undefined;
  if (typeof value === "string") return value;
  if (typeof value === "object") {
    const candidate = value as Record<string, unknown>;
    if ("toString" in candidate && typeof candidate.toString === "function") {
      const str = candidate.toString();
      if (typeof str === "string" && str !== "[object Object]") {
        return str;
      }
    }
    if ("_id" in candidate) return extractId(candidate._id);
    if ("id" in candidate) return extractId(candidate.id);
  }
  return undefined;
};

const mapManager = (manager: unknown) => {
  if (!manager) return undefined;

  const doc =
    typeof manager === "object" && manager !== null
      ? "toObject" in (manager as any)
        ? (manager as HydratedDocument<UserDocument>).toObject()
        : (manager as Record<string, unknown>)
      : undefined;

  if (!doc) return undefined;

  const id = extractId(doc);
  if (!id) return undefined;

  return {
    id,
    firstName: (doc.firstName as string | undefined) ?? "",
    lastName: (doc.lastName as string | undefined) ?? "",
    email: (doc.email as string | undefined) ?? "",
    role: (doc.role as string | undefined) ?? "",
  };
};

const ensureManagerEligible = async (managerId: string) => {
  const manager = await UserModel.findById(managerId);
  if (!manager) {
    const error = new Error("Manager not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }
  if (
    !ALLOWED_MANAGER_ROLES.includes(manager.role as AllowedManagerRole) ||
    manager.status !== "approved" ||
    !manager.isActive
  ) {
    const error = new Error("Manager must be an active approved staff member");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }
  return manager.id.toString();
};

export const branchService = {
  list: async (country?: string) => {
    const query = country ? { country } : {};
    const branches = await BranchModel.find(query).populate(
      "manager",
      "firstName lastName email role status isActive"
    );
    return branches.map((branch) => ({
      id: branch.id.toString(),
      name: branch.name,
      code: branch.code,
      address: branch.address,
      country: branch.country,
      isActive: branch.isActive,
      contactNumber: branch.contactNumber,
      manager: mapManager(branch.manager),
    }));
  },

  create: async (payload: unknown) => {
    const data = branchCreateSchema.parse(payload);

    const managerId =
      data.managerId !== undefined && data.managerId !== ""
        ? await ensureManagerEligible(data.managerId)
        : undefined;

    const branch = await BranchModel.create({
      name: data.name,
      country: data.country,
      code: data.code,
      address: data.address,
      contactNumber: data.contactNumber,
      isActive: data.isActive ?? true,
      manager: managerId,
    });

    let managerInfo;
    if (managerId) {
      const manager = await UserModel.findById(managerId);
      managerInfo = mapManager(manager ?? undefined);
    }

    return {
      id: branch.id.toString(),
      name: branch.name,
      code: branch.code,
      address: branch.address,
      country: branch.country,
      isActive: branch.isActive,
      contactNumber: branch.contactNumber,
      manager: managerInfo,
    };
  },

  update: async (id: string, payload: unknown) => {
    const data = branchUpdateSchema.parse(payload);

    let managerId: string | null | undefined = undefined;
    if (data.managerId !== undefined) {
      if (!data.managerId) {
        managerId = null;
      } else {
        managerId = await ensureManagerEligible(data.managerId);
      }
    }

    const updatePayload: Record<string, unknown> = {
      ...data,
    };

    if (data.managerId !== undefined) {
      updatePayload.manager = managerId;
    }

    const branch = await BranchModel.findByIdAndUpdate(id, updatePayload, {
      new: true,
      runValidators: true,
    }).populate("manager", "firstName lastName email role status isActive");

    if (!branch) {
      const error = new Error("Branch not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    return {
      id: branch.id.toString(),
      name: branch.name,
      code: branch.code,
      address: branch.address,
      country: branch.country,
      isActive: branch.isActive,
      contactNumber: branch.contactNumber,
      manager: mapManager(branch.manager),
    };
  },

  remove: async (id: string) => {
    const branch = await BranchModel.findById(id);
    if (!branch) {
      const error = new Error("Branch not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    await BranchModel.deleteOne({ _id: id });

    return {
      id: branch.id.toString(),
      deleted: true,
    };
  },
};
