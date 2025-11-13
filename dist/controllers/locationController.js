"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.LocationController = void 0;
const locationService_1 = require("../services/locationService");
exports.LocationController = {
    hierarchy: async (_req, res) => {
        const tree = await locationService_1.locationService.listHierarchy();
        res.json(tree);
    },
    createProvince: async (req, res) => {
        const province = await locationService_1.locationService.createProvince(req.body);
        res.status(201).json(province);
    },
    updateProvince: async (req, res) => {
        const province = await locationService_1.locationService.updateProvince(req.params.id, req.body);
        res.json(province);
    },
    deleteProvince: async (req, res) => {
        const result = await locationService_1.locationService.deleteProvince(req.params.id);
        res.json(result);
    },
    createDistrict: async (req, res) => {
        const district = await locationService_1.locationService.createDistrict(req.body);
        res.status(201).json(district);
    },
    updateDistrict: async (req, res) => {
        const district = await locationService_1.locationService.updateDistrict(req.params.id, req.body);
        res.json(district);
    },
    deleteDistrict: async (req, res) => {
        const result = await locationService_1.locationService.deleteDistrict(req.params.id);
        res.json(result);
    },
    createVillage: async (req, res) => {
        const village = await locationService_1.locationService.createVillage(req.body);
        res.status(201).json(village);
    },
    updateVillage: async (req, res) => {
        const village = await locationService_1.locationService.updateVillage(req.params.id, req.body);
        res.json(village);
    },
    deleteVillage: async (req, res) => {
        const result = await locationService_1.locationService.deleteVillage(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=locationController.js.map