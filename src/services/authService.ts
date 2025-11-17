import { randomUUID } from "crypto";
import bcrypt from "bcryptjs";
import {
  registerSchema,
  loginSchema,
  refreshSchema,
  checkEmailSchema,
  sendVerificationCodeSchema,
  verifyCodeSchema,
} from "../validators/authSchemas";
import { UserDocument, UserModel } from "../models/User";
import { WalletDocument, WalletModel } from "../models/Wallet";
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from "../utils/token";
import { ROLES } from "../types/roles";
import { env } from "../config/env";
import { EmailVerificationModel } from "../models/EmailVerification";
import { StaffProfileModel } from "../models/StaffProfile";
import { generateUserShippingCode } from "../utils/userShippingCode";

const SALT_ROUNDS = 10;
const OTP_CODE = "0000";
const OTP_TTL_MS = 10 * 60 * 1000;

const httpError = (message: string, status: number) => {
  const error = new Error(message) as Error & { status?: number };
  error.status = status;
  return error;
};

const mapUser = (user: UserDocument) => ({
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

const mapStaffProfile = (staff: any) =>
  staff
    ? {
        id: staff._id?.toString?.() ?? staff.id?.toString?.() ?? undefined,
        jobTitle: staff.jobTitle ?? "",
        permissions: staff.permissions ?? [],
        isActive: staff.isActive ?? true,
        branch: staff.branch
          ? {
              id:
                staff.branch._id?.toString?.() ??
                staff.branch.id?.toString?.() ??
                undefined,
              name: staff.branch.name,
              code: staff.branch.code,
            }
          : undefined,
      }
    : undefined;

const ensureEmailAvailable = async (email: string) => {
  const existing = await UserModel.findOne({ email });
  if (existing) {
    throw httpError("Email already registered", 409);
  }
};

export const authService = {
  checkEmailAvailability: async (payload: unknown) => {
    const { email } = checkEmailSchema.parse(payload);
    const existing = await UserModel.findOne({ email });
    return { available: !existing };
  },

  sendVerificationCode: async (payload: unknown) => {
    const { email } = sendVerificationCodeSchema.parse(payload);
    await ensureEmailAvailable(email);

    const expiresAt = new Date(Date.now() + OTP_TTL_MS);

    await EmailVerificationModel.findOneAndUpdate(
      { email },
      {
        code: OTP_CODE,
        expiresAt,
        verifiedAt: null,
        verificationToken: undefined,
      },
      { upsert: true, new: true, setDefaultsOnInsert: true }
    );

    return { sent: true, code: OTP_CODE, expiresAt };
  },

  verifyVerificationCode: async (payload: unknown) => {
    const { email, code } = verifyCodeSchema.parse(payload);

    const record = await EmailVerificationModel.findOne({ email });
    if (!record) {
      throw httpError("Verification code not requested", 400);
    }

    if (record.expiresAt.getTime() < Date.now()) {
      throw httpError("Verification code expired", 410);
    }

    if (record.code !== code) {
      throw httpError("Invalid verification code", 400);
    }

    const verificationToken = randomUUID();

    record.verificationToken = verificationToken;
    record.verifiedAt = new Date();
    record.expiresAt = new Date(Date.now() + OTP_TTL_MS);
    await record.save();

    return { verificationToken };
  },

  getProfile: async (userId: string) => {
    const user = await UserModel.findById(userId);
    if (!user) {
      throw httpError("User not found", 404);
    }
    const staffProfile = await StaffProfileModel.findOne({ user: user._id })
      .populate({ path: "branch", select: "name code" })
      .lean();
    const mapped = mapUser(user);
    if (staffProfile) {
      (mapped as any).staff = mapStaffProfile(staffProfile);
    }
    return mapped;
  },

  register: async (payload: unknown) => {
    const data = registerSchema.parse(payload);

    await ensureEmailAvailable(data.email);

    const verification = await EmailVerificationModel.findOne({
      email: data.email,
      verificationToken: data.verificationToken,
    });

    if (
      !verification ||
      !verification.verifiedAt ||
      verification.expiresAt.getTime() < Date.now()
    ) {
      throw httpError("Email not verified", 400);
    }

    const passwordHash = await bcrypt.hash(data.password, SALT_ROUNDS);
    const userCountry = data.country ?? env.DEFAULT_COUNTRY;
    const shippingCode = await generateUserShippingCode(userCountry);

    const user = (await UserModel.create({
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
    })) as UserDocument;

    if (
      user.role === ROLES.USER_BUSINESS ||
      user.role === ROLES.USER_PERSONAL
    ) {
      const wallet = (await WalletModel.create({
        user: user._id,
        balance: 0,
        currency: env.DEFAULT_COUNTRY === "LB" ? "LBP" : "USD",
      })) as WalletDocument;
      user.wallet = wallet.id;
      await user.save();
    }

    await EmailVerificationModel.deleteOne({ _id: verification._id }).catch(
      () => undefined
    );

    return mapUser(user);
  },

  login: async (payload: unknown) => {
    const data = loginSchema.parse(payload);

    const user = await UserModel.findOne({ email: data.email });
    if (!user) {
      const error = new Error("Invalid credentials");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    if (user.status !== "approved") {
      const error = new Error("Account pending approval");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    if (!user.isActive) {
      const error = new Error("Account disabled");
      (error as Error & { status?: number }).status = 403;
      throw error;
    }

    const valid = await bcrypt.compare(data.password, user.passwordHash);
    if (!valid) {
      const error = new Error("Invalid credentials");
      (error as Error & { status?: number }).status = 401;
      throw error;
    }

    const tokenPayload = {
      userId: user.id.toString(),
      id: user.id.toString(),
      roles: [user.role],
      country: user.country,
    };

    const accessToken = signAccessToken(tokenPayload);

    const refreshToken = signRefreshToken(tokenPayload);

    const staffProfile = await StaffProfileModel.findOne({ user: user._id })
      .populate({ path: "branch", select: "name code" })
      .lean();

    const mappedUser = mapUser(user);
    if (staffProfile) {
      (mappedUser as any).staff = mapStaffProfile(staffProfile);
    }

    return { accessToken, refreshToken, user: mappedUser };
  },

  refresh: async (payload: unknown) => {
    const data = refreshSchema.parse(payload);
    const decoded = verifyRefreshToken(data.refreshToken);

    const tokenPayload = {
      userId: decoded.userId,
      id: decoded.id ?? decoded.userId,
      roles: decoded.roles,
      country: decoded.country,
    };
    const accessToken = signAccessToken(tokenPayload);
    const refreshToken = signRefreshToken(tokenPayload);

    return { accessToken, refreshToken };
  },
};
