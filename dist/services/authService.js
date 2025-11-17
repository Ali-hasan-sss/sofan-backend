"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const crypto_1 = require("crypto");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const authSchemas_1 = require("../validators/authSchemas");
const User_1 = require("../models/User");
const Wallet_1 = require("../models/Wallet");
const token_1 = require("../utils/token");
const roles_1 = require("../types/roles");
const env_1 = require("../config/env");
const EmailVerification_1 = require("../models/EmailVerification");
const StaffProfile_1 = require("../models/StaffProfile");
const userShippingCode_1 = require("../utils/userShippingCode");
const SALT_ROUNDS = 10;
const OTP_CODE = "0000";
const OTP_TTL_MS = 10 * 60 * 1000;
const httpError = (message, status) => {
    const error = new Error(message);
    error.status = status;
    return error;
};
const mapUser = (user) => ({
    id: user.id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    role: user.role,
    status: user.status,
    country: user.country,
    shippingCode: user.shippingCode,
    branch: user.branch,
    locale: user.locale,
    isActive: user.isActive,
});
const mapStaffProfile = (staff) => staff
    ? {
        id: staff._id?.toString?.() ?? staff.id?.toString?.() ?? undefined,
        jobTitle: staff.jobTitle ?? "",
        permissions: staff.permissions ?? [],
        isActive: staff.isActive ?? true,
        branch: staff.branch
            ? {
                id: staff.branch._id?.toString?.() ??
                    staff.branch.id?.toString?.() ??
                    undefined,
                name: staff.branch.name,
                code: staff.branch.code,
            }
            : undefined,
    }
    : undefined;
const ensureEmailAvailable = async (email) => {
    const existing = await User_1.UserModel.findOne({ email });
    if (existing) {
        throw httpError("Email already registered", 409);
    }
};
exports.authService = {
    checkEmailAvailability: async (payload) => {
        const { email } = authSchemas_1.checkEmailSchema.parse(payload);
        const existing = await User_1.UserModel.findOne({ email });
        return { available: !existing };
    },
    sendVerificationCode: async (payload) => {
        const { email } = authSchemas_1.sendVerificationCodeSchema.parse(payload);
        await ensureEmailAvailable(email);
        const expiresAt = new Date(Date.now() + OTP_TTL_MS);
        await EmailVerification_1.EmailVerificationModel.findOneAndUpdate({ email }, {
            code: OTP_CODE,
            expiresAt,
            verifiedAt: null,
            verificationToken: undefined,
        }, { upsert: true, new: true, setDefaultsOnInsert: true });
        return { sent: true, code: OTP_CODE, expiresAt };
    },
    verifyVerificationCode: async (payload) => {
        const { email, code } = authSchemas_1.verifyCodeSchema.parse(payload);
        const record = await EmailVerification_1.EmailVerificationModel.findOne({ email });
        if (!record) {
            throw httpError("Verification code not requested", 400);
        }
        if (record.expiresAt.getTime() < Date.now()) {
            throw httpError("Verification code expired", 410);
        }
        if (record.code !== code) {
            throw httpError("Invalid verification code", 400);
        }
        const verificationToken = (0, crypto_1.randomUUID)();
        record.verificationToken = verificationToken;
        record.verifiedAt = new Date();
        record.expiresAt = new Date(Date.now() + OTP_TTL_MS);
        await record.save();
        return { verificationToken };
    },
    getProfile: async (userId) => {
        const user = await User_1.UserModel.findById(userId);
        if (!user) {
            throw httpError("User not found", 404);
        }
        const staffProfile = await StaffProfile_1.StaffProfileModel.findOne({ user: user._id })
            .populate({ path: "branch", select: "name code" })
            .lean();
        const mapped = mapUser(user);
        if (staffProfile) {
            mapped.staff = mapStaffProfile(staffProfile);
        }
        return mapped;
    },
    register: async (payload) => {
        const data = authSchemas_1.registerSchema.parse(payload);
        await ensureEmailAvailable(data.email);
        const verification = await EmailVerification_1.EmailVerificationModel.findOne({
            email: data.email,
            verificationToken: data.verificationToken,
        });
        if (!verification ||
            !verification.verifiedAt ||
            verification.expiresAt.getTime() < Date.now()) {
            throw httpError("Email not verified", 400);
        }
        const passwordHash = await bcryptjs_1.default.hash(data.password, SALT_ROUNDS);
        const userCountry = data.country ?? env_1.env.DEFAULT_COUNTRY;
        const shippingCode = await (0, userShippingCode_1.generateUserShippingCode)(userCountry);
        const user = (await User_1.UserModel.create({
            email: data.email,
            passwordHash,
            firstName: data.firstName,
            lastName: data.lastName,
            role: data.role,
            locale: data.locale,
            country: userCountry,
            shippingCode,
            status: "pending",
            isActive: true,
        }));
        if (user.role === roles_1.ROLES.USER_BUSINESS ||
            user.role === roles_1.ROLES.USER_PERSONAL) {
            const wallet = (await Wallet_1.WalletModel.create({
                user: user._id,
                balance: 0,
                currency: env_1.env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
            }));
            user.wallet = wallet.id;
            await user.save();
        }
        await EmailVerification_1.EmailVerificationModel.deleteOne({ _id: verification._id }).catch(() => undefined);
        return mapUser(user);
    },
    login: async (payload) => {
        const data = authSchemas_1.loginSchema.parse(payload);
        const user = await User_1.UserModel.findOne({ email: data.email });
        if (!user) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        if (user.status !== "approved") {
            const error = new Error("Account pending approval");
            error.status = 403;
            throw error;
        }
        if (!user.isActive) {
            const error = new Error("Account disabled");
            error.status = 403;
            throw error;
        }
        const valid = await bcryptjs_1.default.compare(data.password, user.passwordHash);
        if (!valid) {
            const error = new Error("Invalid credentials");
            error.status = 401;
            throw error;
        }
        const tokenPayload = {
            userId: user.id.toString(),
            id: user.id.toString(),
            roles: [user.role],
            country: user.country,
        };
        const accessToken = (0, token_1.signAccessToken)(tokenPayload);
        const refreshToken = (0, token_1.signRefreshToken)(tokenPayload);
        const staffProfile = await StaffProfile_1.StaffProfileModel.findOne({ user: user._id })
            .populate({ path: "branch", select: "name code" })
            .lean();
        const mappedUser = mapUser(user);
        if (staffProfile) {
            mappedUser.staff = mapStaffProfile(staffProfile);
        }
        return { accessToken, refreshToken, user: mappedUser };
    },
    refresh: async (payload) => {
        const data = authSchemas_1.refreshSchema.parse(payload);
        const decoded = (0, token_1.verifyRefreshToken)(data.refreshToken);
        const tokenPayload = {
            userId: decoded.userId,
            id: decoded.id ?? decoded.userId,
            roles: decoded.roles,
            country: decoded.country,
        };
        const accessToken = (0, token_1.signAccessToken)(tokenPayload);
        const refreshToken = (0, token_1.signRefreshToken)(tokenPayload);
        return { accessToken, refreshToken };
    },
};
//# sourceMappingURL=authService.js.map