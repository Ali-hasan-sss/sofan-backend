"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffProfileModel = void 0;
const mongoose_1 = require("mongoose");
const StaffProfileSchema = new mongoose_1.Schema({
    user: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "User",
        required: true,
        unique: true,
        index: true,
    },
    jobTitle: { type: String, trim: true },
    permissions: { type: [String], default: [] },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    isActive: { type: Boolean, default: true },
}, { timestamps: true });
exports.StaffProfileModel = (0, mongoose_1.model)("StaffProfile", StaffProfileSchema);
//# sourceMappingURL=StaffProfile.js.map