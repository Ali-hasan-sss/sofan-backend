"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminController = void 0;
const adminService_1 = require("../services/adminService");
exports.AdminController = {
    overview: async (_req, res) => {
        const data = await adminService_1.adminService.getOverview();
        res.json(data);
    },
};
//# sourceMappingURL=adminController.js.map