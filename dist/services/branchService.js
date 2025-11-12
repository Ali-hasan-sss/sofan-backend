"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.branchService = void 0;
const branchSchemas_1 = require("../validators/branchSchemas");
const Branch_1 = require("../models/Branch");
const User_1 = require("../models/User");
const roles_1 = require("../types/roles");
const ALLOWED_MANAGER_ROLES = [
    roles_1.ROLES.BRANCH_ADMIN,
    roles_1.ROLES.EMPLOYEE,
];
const extractId = (value) => {
    if (!value)
        return undefined;
    if (typeof value === "string")
        return value;
    if (typeof value === "object") {
        const candidate = value;
        if ("toString" in candidate && typeof candidate.toString === "function") {
            const str = candidate.toString();
            if (typeof str === "string" && str !== "[object Object]") {
                return str;
            }
        }
        if ("_id" in candidate)
            return extractId(candidate._id);
        if ("id" in candidate)
            return extractId(candidate.id);
    }
    return undefined;
};
const mapManager = (manager) => {
    if (!manager)
        return undefined;
    const doc = typeof manager === "object" && manager !== null
        ? "toObject" in manager
            ? manager.toObject()
            : manager
        : undefined;
    if (!doc)
        return undefined;
    const id = extractId(doc);
    if (!id)
        return undefined;
    return {
        id,
        firstName: doc.firstName ?? "",
        lastName: doc.lastName ?? "",
        email: doc.email ?? "",
        role: doc.role ?? "",
    };
};
const ensureManagerEligible = async (managerId) => {
    const manager = await User_1.UserModel.findById(managerId);
    if (!manager) {
        const error = new Error("Manager not found");
        error.status = 404;
        throw error;
    }
    if (!ALLOWED_MANAGER_ROLES.includes(manager.role) ||
        manager.status !== "approved" ||
        !manager.isActive) {
        const error = new Error("Manager must be an active approved staff member");
        error.status = 400;
        throw error;
    }
    return manager.id.toString();
};
exports.branchService = {
    list: async (country) => {
        const query = country ? { country } : {};
        const branches = await Branch_1.BranchModel.find(query).populate("manager", "firstName lastName email role status isActive");
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
    create: async (payload) => {
        const data = branchSchemas_1.branchCreateSchema.parse(payload);
        const managerId = data.managerId !== undefined && data.managerId !== ""
            ? await ensureManagerEligible(data.managerId)
            : undefined;
        const branch = await Branch_1.BranchModel.create({
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
            const manager = await User_1.UserModel.findById(managerId);
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
    update: async (id, payload) => {
        const data = branchSchemas_1.branchUpdateSchema.parse(payload);
        let managerId = undefined;
        if (data.managerId !== undefined) {
            if (!data.managerId) {
                managerId = null;
            }
            else {
                managerId = await ensureManagerEligible(data.managerId);
            }
        }
        const updatePayload = {
            ...data,
        };
        if (data.managerId !== undefined) {
            updatePayload.manager = managerId;
        }
        const branch = await Branch_1.BranchModel.findByIdAndUpdate(id, updatePayload, {
            new: true,
            runValidators: true,
        }).populate("manager", "firstName lastName email role status isActive");
        if (!branch) {
            const error = new Error("Branch not found");
            error.status = 404;
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
    remove: async (id) => {
        const branch = await Branch_1.BranchModel.findById(id);
        if (!branch) {
            const error = new Error("Branch not found");
            error.status = 404;
            throw error;
        }
        await Branch_1.BranchModel.deleteOne({ _id: id });
        return {
            id: branch.id.toString(),
            deleted: true,
        };
    },
};
//# sourceMappingURL=branchService.js.map