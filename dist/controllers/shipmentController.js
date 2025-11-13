"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ShipmentController = void 0;
const shipmentService_1 = require("../services/shipmentService");
exports.ShipmentController = {
    list: async (req, res) => {
        const shipments = await shipmentService_1.shipmentService.list({
            country: req.user?.country,
            branch: req.query.branch,
            status: req.query.status,
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