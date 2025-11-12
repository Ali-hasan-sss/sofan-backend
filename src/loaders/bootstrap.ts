import bcrypt from "bcryptjs";
import { env } from "../config/env";
import { UserModel } from "../models/User";
import { ROLES } from "../types/roles";
import { logger } from "../utils/logger";

const SALT_ROUNDS = 10;

export const ensureDefaultAdmin = async () => {
  const email = env.DEFAULT_ADMIN_EMAIL;
  const password = env.DEFAULT_ADMIN_PASSWORD;

  const existing = await UserModel.findOne({ email });
  if (existing) {
    if (existing.status !== "approved") {
      existing.status = "approved";
      await existing.save();
      logger.info("Default admin found but not approved. Status updated.");
    }
    return;
  }

  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  await UserModel.create({
    email,
    passwordHash,
    firstName: "Sofan",
    lastName: "Admin",
    role: ROLES.SUPER_ADMIN,
    locale: "en",
    country: env.DEFAULT_COUNTRY,
    status: "approved",
    isActive: true,
  });

  logger.info(
    `Default admin created with email ${email}. Please change the password after first login.`
  );
};
