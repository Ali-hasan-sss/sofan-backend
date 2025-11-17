"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailVerificationModel = void 0;
const mongoose_1 = require("mongoose");
const EmailVerificationSchema = new mongoose_1.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    code: { type: String, required: true },
    expiresAt: { type: Date, required: true },
    verifiedAt: { type: Date },
    verificationToken: { type: String },
}, {
    timestamps: true,
});
EmailVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });
exports.EmailVerificationModel = (0, mongoose_1.model)("EmailVerification", EmailVerificationSchema);
//# sourceMappingURL=EmailVerification.js.map