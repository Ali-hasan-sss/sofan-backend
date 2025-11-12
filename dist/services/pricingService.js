"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.pricingService = void 0;
const pricingSchemas_1 = require("../validators/pricingSchemas");
const PricingRule_1 = require("../models/PricingRule");
const pricing_1 = require("../utils/pricing");
exports.pricingService = {
    calculate: async ({ payload, country, }) => {
        const data = pricingSchemas_1.pricingCalcSchema.parse(payload);
        const rule = data.pricingRuleId
            ? await PricingRule_1.PricingRuleModel.findById(data.pricingRuleId)
            : await PricingRule_1.PricingRuleModel.findOne({ country });
        if (!rule) {
            const error = new Error("Pricing rule not found");
            error.status = 404;
            throw error;
        }
        const pricing = (0, pricing_1.calculatePricing)(rule, {
            packages: data.packages.map((pkg) => ({
                ...pkg,
                declaredValue: { amount: 0, currency: rule.currency },
                goodsType: "general",
            })),
            codAmount: data.codAmount,
            insured: data.insured,
        });
        return pricing;
    },
    listRules: async (country) => {
        const query = country ? { country } : {};
        const rules = await PricingRule_1.PricingRuleModel.find(query).lean();
        return rules.map((rule) => ({
            id: rule._id.toString(),
            country: rule.country,
            currency: rule.currency,
            volumetricDivisor: rule.volumetricDivisor,
            baseRate: rule.baseRate,
        }));
    },
    createRule: async (payload) => {
        const data = pricingSchemas_1.pricingRuleSchema.parse(payload);
        const rule = await PricingRule_1.PricingRuleModel.create(data);
        return {
            id: rule.id.toString(),
            country: rule.country,
            currency: rule.currency,
            volumetricDivisor: rule.volumetricDivisor,
            baseRate: rule.baseRate,
        };
    },
};
//# sourceMappingURL=pricingService.js.map