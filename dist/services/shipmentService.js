"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Shipment_1 = require("../models/Shipment");
const PricingRule_1 = require("../models/PricingRule");
const Wallet_1 = require("../models/Wallet");
const shipmentSchemas_1 = require("../validators/shipmentSchemas");
const pricing_1 = require("../utils/pricing");
const shipmentNumber_1 = require("../utils/shipmentNumber");
exports.shipmentService = {
    list: async (filters) => {
        const filter = shipmentSchemas_1.shipmentFilterSchema.parse(filters);
        const query = {};
        if (filter.country)
            query.country = filter.country;
        if (filter.branch)
            query.$or = [{ branchFrom: filter.branch }, { branchTo: filter.branch }];
        if (filter.status)
            query.status = filter.status;
        const shipments = await Shipment_1.ShipmentModel.find(query)
            .populate("branchFrom", "name code")
            .populate("branchTo", "name code")
            .lean();
        return shipments.map((shipment) => ({
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            pricing: shipment.pricing,
            country: shipment.country,
            type: shipment.type,
            createdAt: shipment.createdAt,
        }));
    },
    create: async ({ data, createdBy, country, }) => {
        const session = await mongoose_1.default.startSession();
        try {
            session.startTransaction();
            const payload = shipmentSchemas_1.shipmentCreateSchema.parse(data);
            const rule = payload.pricingRuleId
                ? await PricingRule_1.PricingRuleModel.findById(payload.pricingRuleId).session(session)
                : await PricingRule_1.PricingRuleModel.findOne({ country }).session(session);
            if (!rule) {
                const error = new Error("Pricing rule not found");
                error.status = 404;
                throw error;
            }
            const packages = payload.packages.map((pkg) => ({
                ...pkg,
                volumetricWeight: Number(((pkg.length * pkg.width * pkg.height) /
                    rule.volumetricDivisor).toFixed(2)),
            }));
            const pricing = (0, pricing_1.calculatePricing)(rule, {
                packages,
                codAmount: payload.codAmount,
                insured: payload.insured,
            });
            const shipmentNumber = await (0, shipmentNumber_1.generateShipmentNumber)(country);
            const shipment = await Shipment_1.ShipmentModel.create([
                {
                    shipmentNumber,
                    country,
                    type: payload.type,
                    branchFrom: payload.branchFrom,
                    branchTo: payload.branchTo,
                    createdBy,
                    sender: payload.sender,
                    recipient: payload.recipient,
                    packages,
                    pricing,
                    codAmount: payload.codAmount,
                    codCurrency: payload.codCurrency ?? pricing.currency,
                },
            ], { session });
            if (payload.codAmount && payload.codAmount > 0) {
                const wallet = await Wallet_1.WalletModel.findOne({ user: createdBy }).session(session);
                if (wallet) {
                    wallet.transactions.push({
                        type: "hold",
                        amount: payload.codAmount,
                        currency: payload.codCurrency ?? pricing.currency,
                        reference: shipmentNumber,
                        createdAt: new Date(),
                        meta: { reason: "COD collection" },
                    });
                    await wallet.save({ session });
                }
            }
            await session.commitTransaction();
            return {
                id: shipment[0].id.toString(),
                shipmentNumber,
                status: shipment[0].status,
                pricing,
            };
        }
        catch (error) {
            await session.abortTransaction();
            throw error;
        }
        finally {
            session.endSession();
        }
    },
    getById: async (id) => {
        const shipment = await Shipment_1.ShipmentModel.findById(id)
            .populate("branchFrom", "name code")
            .populate("branchTo", "name code")
            .lean();
        if (!shipment) {
            const error = new Error("Shipment not found");
            error.status = 404;
            throw error;
        }
        return {
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            pricing: shipment.pricing,
            packages: shipment.packages,
            sender: shipment.sender,
            recipient: shipment.recipient,
            approvals: shipment.approvals,
        };
    },
    getByNumber: async (shipmentNumber) => {
        const shipment = await Shipment_1.ShipmentModel.findOne({ shipmentNumber })
            .populate("branchFrom", "name code")
            .populate("branchTo", "name code")
            .lean();
        if (!shipment) {
            const error = new Error("Shipment not found");
            error.status = 404;
            throw error;
        }
        return {
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            country: shipment.country,
            sender: shipment.sender,
            recipient: shipment.recipient,
            pricing: shipment.pricing,
            packages: shipment.packages,
            updatedAt: shipment.updatedAt,
        };
    },
};
//# sourceMappingURL=shipmentService.js.map