"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = require("mongoose");
const UserSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    passwordHash: { type: String, required: true },
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String },
    role: {
        type: String,
        required: true,
        enum: [
            "SUPER_ADMIN",
            "BRANCH_ADMIN",
            "EMPLOYEE",
            "USER_PERSONAL",
            "USER_BUSINESS",
        ],
    },
    locale: { type: String, enum: ["ar", "en"], default: "en" },
    country: { type: String, required: true },
    shippingCode: {
        type: String,
        unique: true,
        sparse: true,
        uppercase: true,
        trim: true,
    },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    status: {
        type: String,
        enum: ["pending", "approved", "rejected"],
        default: "pending",
    },
    businessName: { type: String },
    wallet: { type: mongoose_1.Schema.Types.ObjectId, ref: "Wallet" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
UserSchema.index({ country: 1, branch: 1 });
UserSchema.index({ shippingCode: 1 });
exports.UserModel = (0, mongoose_1.model)("User", UserSchema);
//# sourceMappingURL=User.js.map