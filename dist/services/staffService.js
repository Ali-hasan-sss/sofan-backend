"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.staffService = void 0;
const StaffProfile_1 = require("../models/StaffProfile");
const User_1 = require("../models/User");
const Branch_1 = require("../models/Branch");
const permissions_1 = require("../types/permissions");
const roles_1 = require("../types/roles");
const STAFF_ROLES = new Set([roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE]);
const ensureUserEligible = async (userId) => {
    const user = await User_1.UserModel.findById(userId);
    if (!user) {
        const error = new Error("User not found");
        error.status = 404;
        throw error;
    }
    if (!STAFF_ROLES.has(user.role)) {
        const error = new Error("User role is not eligible for staff management");
        error.status = 400;
        throw error;
    }
    return user;
};
const ensureBranchExists = async (branchId) => {
    if (!branchId)
        return undefined;
    const branch = await Branch_1.BranchModel.findById(branchId, { _id: 1 });
    if (!branch) {
        const error = new Error("Branch not found");
        error.status = 404;
        throw error;
    }
    return branch._id;
};
const mapStaffProfile = (doc) => {
    if (!doc)
        return null;
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
exports.staffService = {
    list: async ({ branch, search }) => {
        const query = {};
        if (branch) {
            query.branch = branch;
        }
        const staffProfiles = await StaffProfile_1.StaffProfileModel.find(query)
            .populate({
            path: "user",
            select: "firstName lastName email role status branch isActive",
        })
            .populate({ path: "branch", select: "name code" })
            .sort({ createdAt: -1 })
            .lean();
        const mapped = staffProfiles
            .map(mapStaffProfile)
            .filter(Boolean);
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
    create: async (payload) => {
        const user = await ensureUserEligible(payload.userId);
        const existing = await StaffProfile_1.StaffProfileModel.findOne({ user: payload.userId });
        if (existing) {
            const error = new Error("Staff profile already exists for this user");
            error.status = 409;
            throw error;
        }
        const branchId = await ensureBranchExists(payload.branchId);
        const permissions = payload.permissions?.filter((permission) => permissions_1.PERMISSION_LIST.includes(permission)) ?? [];
        const staffProfile = await StaffProfile_1.StaffProfileModel.create({
            user: payload.userId,
            jobTitle: payload.jobTitle,
            permissions,
            branch: branchId,
            isActive: payload.isActive ?? true,
        });
        if (branchId) {
            user.branch = branchId;
        }
        if (payload.isActive !== undefined) {
            user.isActive = payload.isActive;
        }
        await user.save();
        const populated = await StaffProfile_1.StaffProfileModel.findById(staffProfile._id)
            .populate({
            path: "user",
            select: "firstName lastName email role status branch isActive",
        })
            .populate({ path: "branch", select: "name code" })
            .lean();
        return mapStaffProfile(populated);
    },
    update: async (id, payload) => {
        const staffProfile = await StaffProfile_1.StaffProfileModel.findById(id);
        if (!staffProfile) {
            const error = new Error("Staff profile not found");
            error.status = 404;
            throw error;
        }
        if (payload.branchId !== undefined) {
            staffProfile.branch =
                (await ensureBranchExists(payload.branchId)) ?? undefined;
        }
        if (payload.jobTitle !== undefined) {
            staffProfile.jobTitle = payload.jobTitle;
        }
        if (payload.permissions !== undefined) {
            staffProfile.permissions = payload.permissions.filter((permission) => permissions_1.PERMISSION_LIST.includes(permission));
        }
        if (payload.isActive !== undefined) {
            staffProfile.isActive = payload.isActive;
        }
        await staffProfile.save();
        const user = await User_1.UserModel.findById(staffProfile.user);
        if (user) {
            if (payload.branchId !== undefined) {
                user.branch =
                    payload.branchId === null
                        ? undefined
                        : staffProfile.branch ?? undefined;
            }
            if (payload.isActive !== undefined) {
                user.isActive = payload.isActive;
            }
            await user.save();
        }
        const populated = await StaffProfile_1.StaffProfileModel.findById(id)
            .populate({
            path: "user",
            select: "firstName lastName email role status branch isActive",
        })
            .populate({ path: "branch", select: "name code" })
            .lean();
        return mapStaffProfile(populated);
    },
    remove: async (id) => {
        const staffProfile = await StaffProfile_1.StaffProfileModel.findById(id);
        if (!staffProfile) {
            const error = new Error("Staff profile not found");
            error.status = 404;
            throw error;
        }
        await StaffProfile_1.StaffProfileModel.deleteOne({ _id: id });
        return { id, deleted: true };
    },
    getStaffForUser: async (userId) => {
        const staffProfile = await StaffProfile_1.StaffProfileModel.findOne({ user: userId })
            .populate({ path: "branch", select: "name code" })
            .lean();
        return staffProfile ? mapStaffProfile(staffProfile) : null;
    },
};
//# sourceMappingURL=staffService.js.map