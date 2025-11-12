"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const pricingService_1 = require("../services/pricingService");
exports.PricingController = {
    calculate: async (req, res) => {
        const pricing = await pricingService_1.pricingService.calculate({
            payload: req.body,
            country: req.user?.country,
        });
        res.json(pricing);
    },
    listRules: async (req, res) => {
        const rules = await pricingService_1.pricingService.listRules(req.user?.country);
        res.json(rules);
    },
    createRule: async (req, res) => {
        const rule = await pricingService_1.pricingService.createRule(req.body);
        res.status(201).json(rule);
    },
};
//# sourceMappingURL=pricingController.js.map