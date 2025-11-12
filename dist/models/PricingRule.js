"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingRuleModel = void 0;
const mongoose_1 = require("mongoose");
const WeightRangeSchema = new mongoose_1.Schema({
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    ratePerKg: { type: Number, required: true },
}, { _id: false });
const PricingRuleSchema = new mongoose_1.Schema({
    country: { type: String, required: true, index: true },
    branch: { type: mongoose_1.Schema.Types.ObjectId, ref: "Branch" },
    currency: { type: String, required: true },
    volumetricDivisor: { type: Number, required: true },
    pickupFee: { type: Number, default: 0 },
    deliveryFee: { type: Number, default: 0 },
    codFeePercent: { type: Number, default: 0 },
    codFeeFlat: { type: Number, default: 0 },
    insuranceRatePercent: { type: Number, default: 0 },
    weightRanges: { type: [WeightRangeSchema], default: [] },
    baseRate: { type: Number, default: 0 },
}, { timestamps: true });
PricingRuleSchema.index({ country: 1, branch: 1 }, { unique: false });
exports.PricingRuleModel = (0, mongoose_1.model)("PricingRule", PricingRuleSchema);
//# sourceMappingURL=PricingRule.js.map