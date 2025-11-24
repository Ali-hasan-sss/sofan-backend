"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
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
            search: req.query.search,
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
        // Get tracking history
        const { shipmentWorkflowService } = await Promise.resolve().then(() => __importStar(require("../services/shipmentWorkflowService")));
        const tracking = await shipmentWorkflowService.getShipmentTracking(shipment.id);
        res.json({ ...shipment, tracking });
    },
};
//# sourceMappingURL=shipmentController.js.map