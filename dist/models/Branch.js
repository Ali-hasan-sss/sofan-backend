"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchModel = void 0;
const mongoose_1 = require("mongoose");
const BranchSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    country: { type: String, required: true, index: true },
    code: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    contactNumber: { type: String },
    isActive: { type: Boolean, default: true },
    manager: { type: mongoose_1.Schema.Types.ObjectId, ref: "User" },
}, { timestamps: true });
exports.BranchModel = (0, mongoose_1.model)("Branch", BranchSchema);
//# sourceMappingURL=Branch.js.map