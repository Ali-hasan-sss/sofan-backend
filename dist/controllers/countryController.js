"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryController = void 0;
const countryService_1 = require("../services/countryService");
exports.CountryController = {
    list: async (_req, res) => {
        const countries = await countryService_1.countryService.list();
        res.json(countries);
    },
    create: async (req, res) => {
        const country = await countryService_1.countryService.create(req.body);
        res.status(201).json(country);
    },
    update: async (req, res) => {
        const country = await countryService_1.countryService.update(req.params.id, req.body);
        res.json(country);
    },
    remove: async (req, res) => {
        await countryService_1.countryService.remove(req.params.id);
        res.status(204).end();
    },
};
//# sourceMappingURL=countryController.js.map