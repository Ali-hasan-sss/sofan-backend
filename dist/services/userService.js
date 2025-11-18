"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const crypto_1 = require("crypto");
const User_1 = require("../models/User");
const Wallet_1 = require("../models/Wallet");
const Shipment_1 = require("../models/Shipment");
const env_1 = require("../config/env");
const roles_1 = require("../types/roles");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const userSchemas_1 = require("../validators/userSchemas");
const userShippingCode_1 = require("../utils/userShippingCode");
const mapUser = (user) => ({
    id: user._id.toString(),
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    country: user.country,
    shippingCode: user.shippingCode,
    branch: user.branch,
    isActive: user.isActive,
    createdAt: user.createdAt,
});
exports.userService = {
    createByAdmin: async (payload) => {
        const data = userSchemas_1.adminCreateUserSchema.parse(payload);
        const existing = await User_1.UserModel.findOne({ email: data.email });
        if (existing) {
            const error = new Error("Email already registered");
            error.status = 409;
            throw error;
        }
        const generatedPassword = data.password ??
            `${data.firstName.replace(/\s+/g, "")}.${(0, crypto_1.randomBytes)(3)
                .toString("hex")
                .toUpperCase()}`;
        const passwordHash = await bcryptjs_1.default.hash(generatedPassword, 10);
        const userCountry = data.country ?? env_1.env.DEFAULT_COUNTRY;
        const shippingCode = await (0, userShippingCode_1.generateUserShippingCode)(userCountry);
        const user = await User_1.UserModel.create({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            status: "approved",
            isActive: true,
            locale: "en",
            country: userCountry,
            shippingCode,
        });
        if (user.role === roles_1.ROLES.USER_BUSINESS ||
            user.role === roles_1.ROLES.USER_PERSONAL) {
            const wallet = await Wallet_1.WalletModel.create({
                user: user._id,
                balance: 0,
                currency: env_1.env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
            });
            user.wallet = wallet.id;
            await user.save();
        }
        return { user: mapUser(user), generatedPassword };
    },
    listStaff: async () => {
        const users = await User_1.UserModel.find({
            role: { $in: [roles_1.ROLES.BRANCH_ADMIN, roles_1.ROLES.EMPLOYEE] },
            status: "approved",
            isActive: true,
        })
            .sort({ firstName: 1 })
            .lean();
        return users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
        }));
    },
    list: async ({ status, role, search, }) => {
        const query = {};
        if (status) {
            query.status = status;
        }
        if (role) {
            query.role = role;
        }
        if (search) {
            const regex = new RegExp(search, "i");
            query.$or = [{ email: regex }, { firstName: regex }, { lastName: regex }];
        }
        const users = await User_1.UserModel.find(query).sort({ createdAt: -1 }).lean();
        return users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            status: user.status,
            country: user.country,
            shippingCode: user.shippingCode,
            createdAt: user.createdAt,
            isActive: user.isActive ?? true,
        }));
    },
    listPending: async (country) => {
        const query = { status: "pending" };
        if (country)
            query.country = country;
        const users = await User_1.UserModel.find(query).lean();
        return users.map((user) => ({
            id: user._id.toString(),
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            role: user.role,
            country: user.country,
            shippingCode: user.shippingCode,
            isActive: user.isActive ?? true,
        }));
    },
    updateStatus: async (userId, status, approvedBy) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        user.status = status;
        await user.save();
        if (status === "approved" && !user.wallet) {
            const wallet = await Wallet_1.WalletModel.create({
                user: user._id,
                balance: 0,
                currency: env_1.env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
            });
            user.wallet = wallet.id;
            await user.save();
        }
        return { user: mapUser(user), approvedBy };
    },
    setActiveState: async (userId, isActive) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (user.role === roles_1.ROLES.SUPER_ADMIN) {
            const error = new Error("Cannot change status of super admin");
            error.status = 400;
            throw error;
        }
        user.isActive = isActive;
        await user.save();
        return mapUser(user);
    },
    update: async (userId, payload) => {
        const data = userSchemas_1.adminUpdateUserSchema.parse(payload);
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (user.role === roles_1.ROLES.SUPER_ADMIN) {
            const error = new Error("Cannot modify super admin");
            error.status = 400;
            throw error;
        }
        // Check if email is being changed and if it's already taken
        if (data.email && data.email !== user.email) {
            const existing = await User_1.UserModel.findOne({ email: data.email });
            if (existing) {
                const error = new Error("Email already registered");
                error.status = 409;
                throw error;
            }
            user.email = data.email;
        }
        if (data.firstName) {
            user.firstName = data.firstName;
        }
        if (data.lastName) {
            user.lastName = data.lastName;
        }
        if (data.role) {
            user.role = data.role;
        }
        if (data.country !== undefined) {
            user.country = data.country;
        }
        if (data.password) {
            const passwordHash = await bcryptjs_1.default.hash(data.password, 10);
            user.passwordHash = passwordHash;
        }
        await user.save();
        return mapUser(user);
    },
    deleteUser: async (userId) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (user.role === roles_1.ROLES.SUPER_ADMIN) {
            const error = new Error("Cannot delete super admin");
            error.status = 400;
            throw error;
        }
        if (user.wallet) {
            await Wallet_1.WalletModel.findByIdAndDelete(user.wallet);
        }
        await User_1.UserModel.findByIdAndDelete(userId);
        return { id: userId };
    },
    updateProfile: async (userId, payload) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        // Check if email is being changed and if it's already taken
        if (payload.email && payload.email !== user.email) {
            const existing = await User_1.UserModel.findOne({ email: payload.email });
            if (existing) {
                const error = new Error("Email already registered");
                error.status = 409;
                throw error;
            }
            user.email = payload.email;
        }
        if (payload.firstName) {
            user.firstName = payload.firstName;
        }
        if (payload.lastName) {
            user.lastName = payload.lastName;
        }
        if (payload.phone !== undefined) {
            user.phone = payload.phone || undefined;
        }
        await user.save();
        return mapUser(user);
    },
    changePassword: async (userId, currentPassword, newPassword) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        const isCurrentPasswordValid = await bcryptjs_1.default.compare(currentPassword, user.passwordHash);
        if (!isCurrentPasswordValid) {
            const error = new Error("Current password is incorrect");
            error.status = 400;
            throw error;
        }
        const passwordHash = await bcryptjs_1.default.hash(newPassword, 10);
        user.passwordHash = passwordHash;
        await user.save();
        return { success: true };
    },
    getDashboardOverview: async (userId) => {
        const shipments = await Shipment_1.ShipmentModel.find({ createdBy: userId }).lean();
        const totalShipments = shipments.length;
        const pendingShipments = shipments.filter((s) => s.status === "pending_approval" || s.status === "awaiting_pickup").length;
        const completedShipments = shipments.filter((s) => s.status === "delivered").length;
        // Get recent shipments (last 5)
        const recentShipments = shipments
            .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
            .slice(0, 5)
            .map((shipment) => ({
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            createdAt: shipment.createdAt,
        }));
        // Get wallet balance
        const user = await User_1.UserModel.findById(userId).lean();
        let walletBalance = { local: 0, usd: 0 };
        if (user?.wallet) {
            const wallet = await Wallet_1.WalletModel.findById(user.wallet).lean();
            if (wallet) {
                // Convert to both currencies (simplified - you may need actual conversion rates)
                if (wallet.currency === "USD") {
                    walletBalance.usd = wallet.balance;
                    walletBalance.local = wallet.balance * 3.75; // Example conversion rate
                }
                else {
                    walletBalance.local = wallet.balance;
                    walletBalance.usd = wallet.balance / 3.75; // Example conversion rate
                }
            }
        }
        return {
            totalShipments,
            pendingShipments,
            completedShipments,
            walletBalance,
            recentShipments,
        };
    },
    deleteMyAccount: async (userId, password) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            const error = new Error("User not found");
            error.status = 404;
            throw error;
        }
        if (user.role === roles_1.ROLES.SUPER_ADMIN) {
            const error = new Error("Cannot delete super admin account");
            error.status = 400;
            throw error;
        }
        // Verify password
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.passwordHash);
        if (!isPasswordValid) {
            const error = new Error("Invalid password");
            error.status = 400;
            throw error;
        }
        // Delete wallet if exists
        if (user.wallet) {
            await Wallet_1.WalletModel.findByIdAndDelete(user.wallet);
        }
        // Delete user
        await User_1.UserModel.findByIdAndDelete(userId);
        return { success: true, message: "Account deleted successfully" };
    },
};
//# sourceMappingURL=userService.js.map