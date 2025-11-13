"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PricingController = void 0;
const pricingService_1 = require("../services/pricingService");
exports.PricingController = {
    calculate: async (req, res) => {
        const pricing = await pricingService_1.pricingService.calculate({ payload: req.body });
        res.json(pricing);
    },
    listRates: async (_req, res) => {
        const rates = await pricingService_1.pricingService.listRates();
        res.json(rates);
    },
    createRate: async (req, res) => {
        const rate = await pricingService_1.pricingService.createRate(req.body);
        res.status(201).json(rate);
    },
    updateRate: async (req, res) => {
        const rate = await pricingService_1.pricingService.updateRate(req.params.id, req.body);
        res.json(rate);
    },
    removeRate: async (req, res) => {
        const result = await pricingService_1.pricingService.removeRate(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=pricingController.js.map