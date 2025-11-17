import { randomBytes } from "crypto";
import { Types } from "mongoose";
import { UserModel } from "../models/User";
import { WalletModel } from "../models/Wallet";
import { env } from "../config/env";
import { ROLES, type Role } from "../types/roles";
import bcrypt from "bcryptjs";
import {
  adminCreateUserSchema,
  adminUpdateUserSchema,
} from "../validators/userSchemas";
import { generateUserShippingCode } from "../utils/userShippingCode";

const mapUser = (user: typeof UserModel.prototype) => ({
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

export const userService = {
  createByAdmin: async (payload: unknown) => {
    const data = adminCreateUserSchema.parse(payload);

    const existing = await UserModel.findOne({ email: data.email });
    if (existing) {
      const error = new Error("Email already registered");
      (error as Error & { status?: number }).status = 409;
      throw error;
    }

    const generatedPassword =
      data.password ??
      `${data.firstName.replace(/\s+/g, "")}.${randomBytes(3)
        .toString("hex")
        .toUpperCase()}`;
    const passwordHash = await bcrypt.hash(generatedPassword, 10);

    const userCountry = data.country ?? env.DEFAULT_COUNTRY;
    const shippingCode = await generateUserShippingCode(userCountry);

    const user = await UserModel.create({
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

    if (
      user.role === ROLES.USER_BUSINESS ||
      user.role === ROLES.USER_PERSONAL
    ) {
      const wallet = await WalletModel.create({
        user: user._id as Types.ObjectId,
        balance: 0,
        currency: env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
      });
      user.wallet = wallet.id;
      await user.save();
    }

    return { user: mapUser(user), generatedPassword };
  },

  listStaff: async () => {
    const users = await UserModel.find({
      role: { $in: [ROLES.BRANCH_ADMIN, ROLES.EMPLOYEE] },
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

  list: async ({
    status,
    role,
    search,
  }: {
    status?: string;
    role?: string;
    search?: string;
  }) => {
    const query: Record<string, unknown> = {};
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

    const users = await UserModel.find(query).sort({ createdAt: -1 }).lean();

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

  listPending: async (country?: string) => {
    const query = { status: "pending" } as { status: string; country?: string };
    if (country) query.country = country;
    const users = await UserModel.find(query).lean();
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

  updateStatus: async (
    userId: string,
    status: "approved" | "rejected",
    approvedBy?: string
  ) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    user.status = status;
    await user.save();

    if (status === "approved" && !user.wallet) {
      const wallet = await WalletModel.create({
        user: user._id as Types.ObjectId,
        balance: 0,
        currency: env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
      });
      user.wallet = wallet.id;
      await user.save();
    }

    return { user: mapUser(user), approvedBy };
  },

  setActiveState: async (userId: string, isActive: boolean) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      const error = new Error("Cannot change status of super admin");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    user.isActive = isActive;
    await user.save();

    return mapUser(user);
  },

  update: async (userId: string, payload: unknown) => {
    const data = adminUpdateUserSchema.parse(payload);

    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      const error = new Error("Cannot modify super admin");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    // Check if email is being changed and if it's already taken
    if (data.email && data.email !== user.email) {
      const existing = await UserModel.findOne({ email: data.email });
      if (existing) {
        const error = new Error("Email already registered");
        (error as Error & { status?: number }).status = 409;
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
      user.role = data.role as Role;
    }
    if (data.country !== undefined) {
      user.country = data.country;
    }
    if (data.password) {
      const passwordHash = await bcrypt.hash(data.password, 10);
      user.passwordHash = passwordHash;
    }

    await user.save();

    return mapUser(user);
  },

  deleteUser: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      const error = new Error("User not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    if (user.role === ROLES.SUPER_ADMIN) {
      const error = new Error("Cannot delete super admin");
      (error as Error & { status?: number }).status = 400;
      throw error;
    }

    if (user.wallet) {
      await WalletModel.findByIdAndDelete(user.wallet);
    }

    await UserModel.findByIdAndDelete(userId);

    return { id: userId };
  },
};
