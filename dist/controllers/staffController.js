"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StaffController = void 0;
const staffService_1 = require("../services/staffService");
exports.StaffController = {
    list: async (req, res) => {
        const staff = await staffService_1.staffService.list({
            branch: req.query.branch,
            search: req.query.search,
        });
        res.json(staff);
    },
    create: async (req, res) => {
        const staffMember = await staffService_1.staffService.create(req.body);
        res.status(201).json(staffMember);
    },
    update: async (req, res) => {
        const staffMember = await staffService_1.staffService.update(req.params.id, req.body);
        res.json(staffMember);
    },
    remove: async (req, res) => {
        const result = await staffService_1.staffService.remove(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=staffController.js.map