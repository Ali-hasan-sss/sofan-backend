"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const shipmentService_1 = require("../services/shipmentService");
const roles_1 = require("../types/roles");
exports.ShipmentController = {
    list: async (req, res) => {
        // If user is USER_PERSONAL or USER_BUSINESS, only show their shipments
        const userRoles = req.user?.roles ?? [];
        const isRegularUser = userRoles.includes(roles_1.ROLES.USER_PERSONAL) ||
            userRoles.includes(roles_1.ROLES.USER_BUSINESS);
        const shipments = await shipmentService_1.shipmentService.list({
            country: req.user?.country,
            branch: req.query.branch,
            status: req.query.status,
            createdBy: isRegularUser ? req.user?.id : undefined,
        });
        res.json(shipments);
    },
    create: async (req, res) => {
        const shipment = await shipmentService_1.shipmentService.create({
            data: req.body,
            createdBy: req.user?.id,
            country: req.user?.country,
        });
        res.status(201).json(shipment);
    },
    getById: async (req, res) => {
        const shipment = await shipmentService_1.shipmentService.getById(req.params.id);
        // If user is USER_PERSONAL or USER_BUSINESS, only allow access to their own shipments
        const userRoles = req.user?.roles ?? [];
        const isRegularUser = userRoles.includes(roles_1.ROLES.USER_PERSONAL) ||
            userRoles.includes(roles_1.ROLES.USER_BUSINESS);
        if (isRegularUser && shipment.createdBy !== req.user?.id) {
            return res.status(403).json({ message: "Forbidden" });
        }
        res.json(shipment);
    },
    update: async (req, res) => {
        const shipment = await shipmentService_1.shipmentService.update({
            id: req.params.id,
            data: req.body,
            updatedBy: req.user?.id,
        });
        res.json(shipment);
    },
    remove: async (req, res) => {
        const result = await shipmentService_1.shipmentService.remove({
            id: req.params.id,
            requestedBy: req.user?.id,
        });
        res.json(result);
    },
    trackPublic: async (req, res) => {
        const shipment = await shipmentService_1.shipmentService.getByNumber(req.params.number);
        res.json(shipment);
    },
};
//# sourceMappingURL=shipmentController.js.map