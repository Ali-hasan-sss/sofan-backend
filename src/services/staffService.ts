import { FilterQuery } from "mongoose";
import { StaffProfileModel } from "../models/StaffProfile";
import { UserModel } from "../models/User";
import { BranchModel } from "../models/Branch";
import { PERMISSION_LIST } from "../types/permissions";
import { ROLES, type Role } from "../types/roles";

const STAFF_ROLES = new Set<Role>([ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE]);

const ensureUserEligible = async (userId: string) => {
  const user = await UserModel.findById(userId);
  if (!user) {
    const error = new Error("User not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }

  if (!STAFF_ROLES.has(user.role)) {
    const error = new Error("User role is not eligible for staff management");
    (error as Error & { status?: number }).status = 400;
    throw error;
  }

  return user;
};

const ensureBranchExists = async (branchId?: string | null) => {
  if (!branchId) return undefined;
  const branch = await BranchModel.findById(branchId, { _id: 1 });
  if (!branch) {
    const error = new Error("Branch not found");
    (error as Error & { status?: number }).status = 404;
    throw error;
  }
  return branch._id;
};

const mapStaffProfile = (doc: any) => {
  if (!doc) return null;

  const branch = doc.branch
    ? {
        id: doc.branch._id ? doc.branch._id.toString() : doc.branch.toString(),
        name: doc.branch.name,
        code: doc.branch.code,
      }
    : undefined;

  const user = doc.user
    ? {
        id: doc.user._id ? doc.user._id.toString() : doc.user.toString(),
        email: doc.user.email,
        firstName: doc.user.firstName,
        lastName: doc.user.lastName,
        role: doc.user.role,
        status: doc.user.status,
        branch: doc.user.branch
          ? doc.user.branch.toString?.() ?? doc.user.branch
          : undefined,
        isActive: doc.user.isActive,
      }
    : undefined;

  return {
    id: doc._id.toString(),
    jobTitle: doc.jobTitle ?? "",
    permissions: doc.permissions ?? [],
    isActive: doc.isActive ?? true,
    branch,
    user,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
};

export const staffService = {
  list: async ({ branch, search }: { branch?: string; search?: string }) => {
    const query: FilterQuery<typeof StaffProfileModel> = {};

    if (branch) {
      query.branch = branch;
    }

    const staffProfiles = await StaffProfileModel.find(query)
      .populate({
        path: "user",
        select: "firstName lastName email role status branch isActive",
      })
      .populate({ path: "branch", select: "name code" })
      .sort({ createdAt: -1 })
      .lean();

    const mapped = staffProfiles
      .map(mapStaffProfile)
      .filter(Boolean) as ReturnType<typeof mapStaffProfile>[];

    if (search) {
      const lowered = search.toLowerCase();
      return mapped.filter((item) => {
        const haystack = [
          item?.user?.firstName ?? "",
          item?.user?.lastName ?? "",
          item?.user?.email ?? "",
          item?.jobTitle ?? "",
        ]
          .join(" ")
          .toLowerCase();
        return haystack.includes(lowered);
      });
    }

    return mapped;
  },

  create: async (payload: {
    userId: string;
    jobTitle?: string;
    permissions?: string[];
    branchId?: string;
    isActive?: boolean;
  }) => {
    const user = await ensureUserEligible(payload.userId);

    const existing = await StaffProfileModel.findOne({ user: payload.userId });
    if (existing) {
      const error = new Error("Staff profile already exists for this user");
      (error as Error & { status?: number }).status = 409;
      throw error;
    }

    const branchId = await ensureBranchExists(payload.branchId);

    const permissions =
      payload.permissions?.filter((permission) =>
        PERMISSION_LIST.includes(permission as any)
      ) ?? [];

    const staffProfile = await StaffProfileModel.create({
      user: payload.userId,
      jobTitle: payload.jobTitle,
      permissions,
      branch: branchId,
      isActive: payload.isActive ?? true,
    });

    if (branchId) {
      user.branch = branchId as any;
    }
    if (payload.isActive !== undefined) {
      user.isActive = payload.isActive;
    }
    await user.save();

    const populated = await StaffProfileModel.findById(staffProfile._id)
      .populate({
        path: "user",
        select: "firstName lastName email role status branch isActive",
      })
      .populate({ path: "branch", select: "name code" })
      .lean();

    return mapStaffProfile(populated);
  },

  update: async (
    id: string,
    payload: {
      jobTitle?: string;
      permissions?: string[];
      branchId?: string | null;
      isActive?: boolean;
    }
  ) => {
    const staffProfile = await StaffProfileModel.findById(id);
    if (!staffProfile) {
      const error = new Error("Staff profile not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (payload.branchId !== undefined) {
      staffProfile.branch =
        ((await ensureBranchExists(payload.branchId)) as any) ?? undefined;
    }

    if (payload.jobTitle !== undefined) {
      staffProfile.jobTitle = payload.jobTitle;
    }

    if (payload.permissions !== undefined) {
      staffProfile.permissions = payload.permissions.filter((permission) =>
        PERMISSION_LIST.includes(permission as any)
      );
    }

    if (payload.isActive !== undefined) {
      staffProfile.isActive = payload.isActive;
    }

    await staffProfile.save();

    const user = await UserModel.findById(staffProfile.user);
    if (user) {
      if (payload.branchId !== undefined) {
        user.branch =
          payload.branchId === null
            ? undefined
            : (staffProfile.branch as any) ?? undefined;
      }
      if (payload.isActive !== undefined) {
        user.isActive = payload.isActive;
      }
      await user.save();
    }

    const populated = await StaffProfileModel.findById(id)
      .populate({
        path: "user",
        select: "firstName lastName email role status branch isActive",
      })
      .populate({ path: "branch", select: "name code" })
      .lean();

    return mapStaffProfile(populated);
  },

  remove: async (id: string) => {
    const staffProfile = await StaffProfileModel.findById(id);
    if (!staffProfile) {
      const error = new Error("Staff profile not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    await StaffProfileModel.deleteOne({ _id: id });
    return { id, deleted: true };
  },

  getStaffForUser: async (userId: string) => {
    const staffProfile = await StaffProfileModel.findOne({ user: userId })
      .populate({ path: "branch", select: "name code" })
      .lean();
    return staffProfile ? mapStaffProfile(staffProfile) : null;
  },
};
