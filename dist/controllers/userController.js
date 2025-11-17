"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const userService_1 = require("../services/userService");
exports.UserController = {
    list: async (req, res) => {
        const users = await userService_1.userService.list({
            status: req.query.status,
            role: req.query.role,
            search: req.query.search,
        });
        res.json(users);
    },
    listStaff: async (_req, res) => {
        const staff = await userService_1.userService.listStaff();
        res.json(staff);
    },
    create: async (req, res) => {
        const result = await userService_1.userService.createByAdmin(req.body);
        res.status(201).json(result);
    },
    listPending: async (req, res) => {
        const users = await userService_1.userService.listPending(req.user?.country);
        res.json(users);
    },
    approve: async (req, res) => {
        const result = await userService_1.userService.updateStatus(req.params.id, "approved", req.user?.id);
        res.json(result);
    },
    reject: async (req, res) => {
        const result = await userService_1.userService.updateStatus(req.params.id, "rejected", req.user?.id);
        res.json(result);
    },
    disable: async (req, res) => {
        const result = await userService_1.userService.setActiveState(req.params.id, false);
        res.json(result);
    },
    activate: async (req, res) => {
        const result = await userService_1.userService.setActiveState(req.params.id, true);
        res.json(result);
    },
    update: async (req, res) => {
        const result = await userService_1.userService.update(req.params.id, req.body);
        res.json(result);
    },
    remove: async (req, res) => {
        const result = await userService_1.userService.deleteUser(req.params.id);
        res.json(result);
    },
};
//# sourceMappingURL=userController.js.map