"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentCounterModel = void 0;
const mongoose_1 = require("mongoose");
const ShipmentCounterSchema = new mongoose_1.Schema({
    country: { type: String, required: true, unique: true },
    seq: { type: Number, default: 0 },
}, { timestamps: true });
exports.ShipmentCounterModel = (0, mongoose_1.model)("ShipmentCounter", ShipmentCounterSchema);
//# sourceMappingURL=ShipmentCounter.js.map