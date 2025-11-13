"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.shipmentService = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const Shipment_1 = require("../models/Shipment");
const Wallet_1 = require("../models/Wallet");
const shipmentSchemas_1 = require("../validators/shipmentSchemas");
const pricing_1 = require("../utils/pricing");
const shipmentNumber_1 = require("../utils/shipmentNumber");
const locationService_1 = require("./locationService");
const VolumeRate_1 = require("../models/VolumeRate");
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
            const packages = payload.packages.map((pkg) => ({
                ...pkg,
                volumetricWeight: Number(((pkg.length * pkg.width * pkg.height) / 1000000).toFixed(4)),
            }));
            const originBranchId = payload.branchFrom;
            const toObjectId = (value) => value ? new mongoose_1.default.Types.ObjectId(value) : undefined;
            const senderAddress = {
                name: payload.sender.name,
                phone: payload.sender.phone,
                address: payload.sender.address,
                ...(payload.sender.provinceId
                    ? { province: toObjectId(payload.sender.provinceId) }
                    : {}),
                ...(payload.sender.districtId
                    ? { district: toObjectId(payload.sender.districtId) }
                    : {}),
                ...(payload.sender.villageId
                    ? { village: toObjectId(payload.sender.villageId) }
                    : {}),
            };
            const recipientBranchId = payload.branchTo ??
                (await locationService_1.locationService
                    .findBranchForVillage(payload.recipient.villageId)
                    .catch(() => undefined));
            const recipientAddress = {
                name: payload.recipient.name,
                phone: payload.recipient.phone,
                address: payload.recipient.address,
                ...(payload.recipient.provinceId
                    ? { province: toObjectId(payload.recipient.provinceId) }
                    : {}),
                ...(payload.recipient.districtId
                    ? { district: toObjectId(payload.recipient.districtId) }
                    : {}),
                ...(payload.recipient.villageId
                    ? { village: toObjectId(payload.recipient.villageId) }
                    : {}),
            };
            const destinationBranchId = recipientBranchId ?? payload.branchTo;
            if (!originBranchId || !destinationBranchId) {
                const error = new Error("Unable to resolve source and destination branches for pricing");
                error.status = 400;
                throw error;
            }
            const rate = await VolumeRate_1.VolumeRateModel.findOne({
                originBranch: originBranchId,
                destinationBranch: destinationBranchId,
                isActive: true,
            }).session(session);
            if (!rate) {
                const error = new Error("Pricing rate not configured for the selected branches");
                error.status = 404;
                throw error;
            }
            const pricingCurrency = payload.pricingCurrency.toUpperCase();
            const pricing = (0, pricing_1.calculatePricing)(rate, {
                packages: packages.map((pkg) => ({
                    length: pkg.length,
                    width: pkg.width,
                    height: pkg.height,
                })),
                shipmentType: payload.type,
                currency: pricingCurrency,
            });
            const shipmentNumber = await (0, shipmentNumber_1.generateShipmentNumber)(country);
            const shipment = await Shipment_1.ShipmentModel.create([
                {
                    shipmentNumber,
                    country,
                    type: payload.type,
                    branchFrom: toObjectId(originBranchId),
                    branchTo: toObjectId(destinationBranchId),
                    createdBy,
                    sender: senderAddress,
                    recipient: recipientAddress,
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
        const mapAddress = (address) => ({
            name: address.name,
            phone: address.phone,
            address: address.address,
            provinceId: address.province ? address.province.toString() : undefined,
            districtId: address.district ? address.district.toString() : undefined,
            villageId: address.village ? address.village.toString() : undefined,
        });
        return {
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            pricing: shipment.pricing,
            packages: shipment.packages,
            sender: mapAddress(shipment.sender),
            recipient: mapAddress(shipment.recipient),
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
        const mapAddress = (address) => ({
            name: address.name,
            phone: address.phone,
            address: address.address,
            provinceId: address.province ? address.province.toString() : undefined,
            districtId: address.district ? address.district.toString() : undefined,
            villageId: address.village ? address.village.toString() : undefined,
        });
        return {
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            country: shipment.country,
            sender: mapAddress(shipment.sender),
            recipient: mapAddress(shipment.recipient),
            pricing: shipment.pricing,
            packages: shipment.packages,
            updatedAt: shipment.updatedAt,
        };
    },
};
//# sourceMappingURL=shipmentService.js.map