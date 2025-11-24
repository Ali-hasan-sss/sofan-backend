"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CourierModel = void 0;
const mongoose_1 = require("mongoose");
const CourierSchema = new mongoose_1.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    phone: { type: String, required: true, index: true },
    email: { type: String, lowercase: true, trim: true },
    branch: {
        type: mongoose_1.Schema.Types.ObjectId,
        ref: "Branch",
        required: true,
        index: true,
    },
    isActive: { type: Boolean, default: true },
    vehicleType: { type: String },
    licenseNumber: { type: String },
}, { timestamps: true });
CourierSchema.index({ branch: 1, isActive: 1 });
exports.CourierModel = (0, mongoose_1.model)("Courier", CourierSchema);
//# sourceMappingURL=Courier.js.map