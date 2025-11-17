"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserShippingCodeCounterModel = void 0;
const mongoose_1 = require("mongoose");
const UserShippingCodeCounterSchema = new mongoose_1.Schema({
    country: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
}, { timestamps: true });
exports.UserShippingCodeCounterModel = (0, mongoose_1.model)("UserShippingCodeCounter", UserShippingCodeCounterSchema);
//# sourceMappingURL=UserShippingCodeCounter.js.map