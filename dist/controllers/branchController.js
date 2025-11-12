"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BranchController = void 0;
const branchService_1 = require("../services/branchService");
exports.BranchController = {
    list: async (req, res) => {
        const roles = req.user?.roles ?? [];
        const isSuperAdmin = roles.includes("SUPER_ADMIN");
        const filterCountry = isSuperAdmin ? undefined : req.user?.country;
        const branches = await branchService_1.branchService.list(filterCountry);
        res.json(branches);
    },
    create: async (req, res) => {
        const branch = await branchService_1.branchService.create(req.body);
        res.status(201).json(branch);
    },
    update: async (req, res) => {
        const branch = await branchService_1.branchService.update(req.params.id, req.body);
        res.json(branch);
    },
    remove: async (req, res) => {
        const result = await branchService_1.branchService.remove(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=branchController.js.map