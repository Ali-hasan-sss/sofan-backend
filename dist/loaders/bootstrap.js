"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ensureDefaultAdmin = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const env_1 = require("../config/env");
const User_1 = require("../models/User");
const roles_1 = require("../types/roles");
const logger_1 = require("../utils/logger");
const SALT_ROUNDS = 10;
const ensureDefaultAdmin = async () => {
    const email = env_1.env.DEFAULT_ADMIN_EMAIL;
    const password = env_1.env.DEFAULT_ADMIN_PASSWORD;
    const existing = await User_1.UserModel.findOne({ email });
    if (existing) {
        if (existing.status !== "approved") {
            existing.status = "approved";
            await existing.save();
            logger_1.logger.info("Default admin found but not approved. Status updated.");
        }
        return;
    }
    const passwordHash = await bcryptjs_1.default.hash(password, SALT_ROUNDS);
    await User_1.UserModel.create({
        email,
        passwordHash,
        firstName: "Sofan",
        lastName: "Admin",
        role: roles_1.ROLES.SUPER_ADMIN,
        locale: "en",
        country: env_1.env.DEFAULT_COUNTRY,
        status: "approved",
        isActive: true,
    });
    logger_1.logger.info(`Default admin created with email ${email}. Please change the password after first login.`);
};
exports.ensureDefaultAdmin = ensureDefaultAdmin;
//# sourceMappingURL=bootstrap.js.map