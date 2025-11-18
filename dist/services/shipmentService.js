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
        if (filters.createdBy)
            query.createdBy = filters.createdBy;
        const shipments = await Shipment_1.ShipmentModel.find(query)
            .populate("branchFrom", "name code")
            .populate("branchTo", "name code")
            .lean();
        const mapAddress = (address) => ({
            name: address.name,
            phone: address.phone,
            address: address.address,
            provinceId: address.province ? address.province.toString() : undefined,
            districtId: address.district ? address.district.toString() : undefined,
            villageId: address.village ? address.village.toString() : undefined,
        });
        return shipments.map((shipment) => ({
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            pricing: shipment.pricing,
            country: shipment.country,
            type: shipment.type,
            paymentMethod: shipment.paymentMethod,
            isFragile: shipment.isFragile,
            additionalInfo: shipment.additionalInfo ?? "",
            goodsValue: shipment.goodsValue ?? null,
            sender: mapAddress(shipment.sender),
            recipient: mapAddress(shipment.recipient),
            branchFrom: shipment.branchFrom && typeof shipment.branchFrom === "object"
                ? "name" in shipment.branchFrom
                    ? {
                        id: shipment.branchFrom._id?.toString?.() ??
                            shipment.branchFrom.id?.toString?.(),
                        name: shipment.branchFrom.name,
                        code: shipment.branchFrom.code,
                    }
                    : undefined
                : undefined,
            branchTo: shipment.branchTo && typeof shipment.branchTo === "object"
                ? "name" in shipment.branchTo
                    ? {
                        id: shipment.branchTo._id?.toString?.() ??
                            shipment.branchTo.id?.toString?.(),
                        name: shipment.branchTo.name,
                        code: shipment.branchTo.code,
                    }
                    : undefined
                : undefined,
            packages: shipment.packages?.map((pkg) => ({
                quantity: pkg.quantity,
                goodsType: pkg.goodsType,
                weight: pkg.weight,
                volumetricWeight: pkg.volumetricWeight,
            })),
            packagesCount: shipment.packages?.reduce((acc, pkg) => acc + (pkg.quantity ?? 1), 0),
            createdAt: shipment.createdAt,
        }));
    },
    create: async ({ data, createdBy, country, }) => {
        const payload = shipmentSchemas_1.shipmentCreateSchema.parse(data);
        const packages = payload.packages.map((pkg) => {
            const quantity = pkg.quantity ?? 1;
            const volumetricWeight = Number((quantity *
                ((pkg.length * pkg.width * pkg.height) / 1000000)).toFixed(4));
            return {
                quantity,
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
                weight: pkg.weight,
                declaredValue: {
                    amount: pkg.declaredValue.amount,
                    currency: pkg.declaredValue.currency.toUpperCase(),
                },
                goodsType: pkg.goodsType.trim(),
                volumetricWeight,
            };
        });
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
        const originBranchId = payload.branchFrom;
        const destinationBranchId = recipientBranchId ?? payload.branchTo;
        if (!originBranchId || !destinationBranchId) {
            const error = new Error("Unable to resolve source and destination branches for pricing");
            error.status = 400;
            throw error;
        }
        let rate = await VolumeRate_1.VolumeRateModel.findOne({
            originBranch: originBranchId,
            destinationBranch: destinationBranchId,
            isActive: true,
        });
        if (!rate) {
            rate = await VolumeRate_1.VolumeRateModel.findOne({
                originBranch: destinationBranchId,
                destinationBranch: originBranchId,
                isActive: true,
            });
        }
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
                quantity: pkg.quantity,
            })),
            shipmentType: payload.type,
            currency: pricingCurrency,
        });
        let walletForPayment = null;
        if (payload.paymentMethod === "wallet") {
            walletForPayment = await Wallet_1.WalletModel.findOne({ user: createdBy });
            if (!walletForPayment) {
                const error = new Error("Wallet not found for this user");
                error.status = 404;
                throw error;
            }
            if (walletForPayment.currency !== pricing.currency) {
                const error = new Error("Wallet currency does not match shipment currency");
                error.status = 400;
                throw error;
            }
            if (walletForPayment.balance < pricing.total) {
                const error = new Error("Insufficient wallet balance to cover shipment cost");
                error.status = 400;
                throw error;
            }
        }
        const shipmentNumber = await (0, shipmentNumber_1.generateShipmentNumber)(country);
        const normalizedCodAmount = typeof payload.codAmount === "number" && payload.codAmount > 0
            ? payload.codAmount
            : undefined;
        const normalizedCodCurrency = normalizedCodAmount
            ? (payload.codCurrency ?? pricing.currency).toUpperCase()
            : undefined;
        let shipmentDoc;
        try {
            shipmentDoc = await Shipment_1.ShipmentModel.create({
                shipmentNumber,
                country,
                type: payload.type,
                paymentMethod: payload.paymentMethod,
                isFragile: payload.isFragile ?? false,
                additionalInfo: payload.additionalInfo,
                goodsValue: payload.goodsValue
                    ? {
                        amount: payload.goodsValue.amount,
                        currency: payload.goodsValue.currency.toUpperCase(),
                    }
                    : undefined,
                branchFrom: toObjectId(originBranchId),
                branchTo: toObjectId(destinationBranchId),
                createdBy,
                sender: senderAddress,
                recipient: recipientAddress,
                packages,
                pricing,
                codAmount: normalizedCodAmount,
                codCurrency: normalizedCodCurrency,
            });
        }
        catch (error) {
            throw error;
        }
        try {
            if (walletForPayment) {
                walletForPayment.balance -= pricing.total;
                walletForPayment.transactions.push({
                    type: "debit",
                    amount: pricing.total,
                    currency: pricing.currency,
                    reference: shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment payment" },
                });
                await walletForPayment.save();
            }
        }
        catch (error) {
            await Shipment_1.ShipmentModel.findByIdAndDelete(shipmentDoc._id).catch(() => undefined);
            throw error;
        }
        if (normalizedCodAmount) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: createdBy });
            if (wallet &&
                wallet.currency === (normalizedCodCurrency ?? pricing.currency)) {
                wallet.transactions.push({
                    type: "hold",
                    amount: normalizedCodAmount,
                    currency: normalizedCodCurrency ?? pricing.currency,
                    reference: shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "COD collection" },
                });
                await wallet.save();
            }
        }
        return {
            id: shipmentDoc.id.toString(),
            shipmentNumber,
            status: shipmentDoc.status,
            pricing,
        };
    },
    update: async ({ id, data, updatedBy, }) => {
        const shipment = await Shipment_1.ShipmentModel.findById(id);
        if (!shipment) {
            const error = new Error("Shipment not found");
            error.status = 404;
            throw error;
        }
        const payload = shipmentSchemas_1.shipmentCreateSchema.parse(data);
        const createdBy = shipment.createdBy.toString();
        const packages = payload.packages.map((pkg) => {
            const quantity = pkg.quantity ?? 1;
            const volumetricWeight = Number((quantity *
                ((pkg.length * pkg.width * pkg.height) / 1000000)).toFixed(4));
            return {
                quantity,
                length: pkg.length,
                width: pkg.width,
                height: pkg.height,
                weight: pkg.weight,
                declaredValue: {
                    amount: pkg.declaredValue.amount,
                    currency: pkg.declaredValue.currency.toUpperCase(),
                },
                goodsType: pkg.goodsType.trim(),
                volumetricWeight,
            };
        });
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
        const originBranchId = payload.branchFrom;
        const destinationBranchId = recipientBranchId ?? payload.branchTo;
        if (!originBranchId || !destinationBranchId) {
            const error = new Error("Unable to resolve source and destination branches for pricing");
            error.status = 400;
            throw error;
        }
        let rate = await VolumeRate_1.VolumeRateModel.findOne({
            originBranch: originBranchId,
            destinationBranch: destinationBranchId,
            isActive: true,
        });
        if (!rate) {
            rate = await VolumeRate_1.VolumeRateModel.findOne({
                originBranch: destinationBranchId,
                destinationBranch: originBranchId,
                isActive: true,
            });
        }
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
                quantity: pkg.quantity,
            })),
            shipmentType: payload.type,
            currency: pricingCurrency,
        });
        const normalizedCodAmount = typeof payload.codAmount === "number" && payload.codAmount > 0
            ? payload.codAmount
            : undefined;
        const normalizedCodCurrency = normalizedCodAmount
            ? (payload.codCurrency ?? pricing.currency).toUpperCase()
            : undefined;
        // Reverse previous wallet debit if applicable
        if (shipment.paymentMethod === "wallet" && shipment.pricing) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: shipment.createdBy });
            if (wallet) {
                wallet.balance += shipment.pricing.total;
                wallet.transactions.push({
                    type: "credit",
                    amount: shipment.pricing.total,
                    currency: shipment.pricing.currency,
                    reference: shipment.shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment update refund" },
                });
                await wallet.save();
            }
        }
        // Release previous COD hold if applicable
        if (shipment.codAmount && shipment.codAmount > 0) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: shipment.createdBy });
            if (wallet &&
                shipment.codCurrency &&
                wallet.currency === shipment.codCurrency) {
                wallet.transactions.push({
                    type: "release",
                    amount: shipment.codAmount,
                    currency: shipment.codCurrency,
                    reference: shipment.shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment update COD release" },
                });
                await wallet.save();
            }
        }
        let walletForPayment = null;
        if (payload.paymentMethod === "wallet") {
            walletForPayment = await Wallet_1.WalletModel.findOne({
                user: shipment.createdBy,
            });
            if (!walletForPayment) {
                const error = new Error("Wallet not found for this user");
                error.status = 404;
                throw error;
            }
            if (walletForPayment.currency !== pricing.currency) {
                const error = new Error("Wallet currency does not match shipment currency");
                error.status = 400;
                throw error;
            }
            if (walletForPayment.balance < pricing.total) {
                const error = new Error("Insufficient wallet balance to cover shipment cost");
                error.status = 400;
                throw error;
            }
        }
        shipment.type = payload.type;
        shipment.paymentMethod = payload.paymentMethod;
        shipment.isFragile = payload.isFragile ?? false;
        shipment.additionalInfo = payload.additionalInfo;
        shipment.goodsValue = payload.goodsValue
            ? {
                amount: payload.goodsValue.amount,
                currency: payload.goodsValue.currency.toUpperCase(),
            }
            : undefined;
        shipment.branchFrom = toObjectId(originBranchId);
        shipment.branchTo = toObjectId(destinationBranchId);
        shipment.sender = senderAddress;
        shipment.recipient = recipientAddress;
        shipment.packages = packages;
        shipment.pricing = pricing;
        shipment.codAmount = normalizedCodAmount;
        shipment.codCurrency = normalizedCodCurrency;
        await shipment.save();
        if (walletForPayment) {
            walletForPayment.balance -= pricing.total;
            walletForPayment.transactions.push({
                type: "debit",
                amount: pricing.total,
                currency: pricing.currency,
                reference: shipment.shipmentNumber,
                createdAt: new Date(),
                meta: { reason: "Shipment updated payment" },
            });
            await walletForPayment.save();
        }
        if (normalizedCodAmount) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: shipment.createdBy });
            if (wallet &&
                wallet.currency === (normalizedCodCurrency ?? pricing.currency)) {
                wallet.transactions.push({
                    type: "hold",
                    amount: normalizedCodAmount,
                    currency: normalizedCodCurrency ?? pricing.currency,
                    reference: shipment.shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment update COD hold" },
                });
                await wallet.save();
            }
        }
        return {
            id: shipment.id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            pricing,
            updatedBy,
        };
    },
    remove: async ({ id, requestedBy }) => {
        const shipment = await Shipment_1.ShipmentModel.findById(id);
        if (!shipment) {
            const error = new Error("Shipment not found");
            error.status = 404;
            throw error;
        }
        if (shipment.paymentMethod === "wallet" && shipment.pricing) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: shipment.createdBy });
            if (wallet) {
                wallet.balance += shipment.pricing.total;
                wallet.transactions.push({
                    type: "credit",
                    amount: shipment.pricing.total,
                    currency: shipment.pricing.currency,
                    reference: shipment.shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment deleted refund" },
                });
                await wallet.save();
            }
        }
        if (shipment.codAmount && shipment.codAmount > 0) {
            const wallet = await Wallet_1.WalletModel.findOne({ user: shipment.createdBy });
            if (wallet &&
                shipment.codCurrency &&
                wallet.currency === shipment.codCurrency) {
                wallet.transactions.push({
                    type: "release",
                    amount: shipment.codAmount,
                    currency: shipment.codCurrency,
                    reference: shipment.shipmentNumber,
                    createdAt: new Date(),
                    meta: { reason: "Shipment deleted COD release" },
                });
                await wallet.save();
            }
        }
        await Shipment_1.ShipmentModel.deleteOne({ _id: id });
        return { id, deleted: true, requestedBy };
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
        const mapBranch = (branch) => branch && typeof branch === "object" && "name" in branch
            ? {
                id: branch._id?.toString?.() ??
                    branch.id?.toString?.() ??
                    branch.toString(),
                name: branch.name,
                code: branch.code,
            }
            : undefined;
        return {
            id: shipment._id.toString(),
            shipmentNumber: shipment.shipmentNumber,
            status: shipment.status,
            type: shipment.type,
            paymentMethod: shipment.paymentMethod,
            isFragile: shipment.isFragile,
            additionalInfo: shipment.additionalInfo ?? "",
            goodsValue: shipment.goodsValue ?? null,
            pricing: shipment.pricing,
            packages: shipment.packages,
            sender: mapAddress(shipment.sender),
            recipient: mapAddress(shipment.recipient),
            branchFrom: mapBranch(shipment.branchFrom),
            branchTo: mapBranch(shipment.branchTo),
            codAmount: shipment.codAmount ?? null,
            codCurrency: shipment.codCurrency ?? null,
            approvals: shipment.approvals,
            createdBy: shipment.createdBy?.toString() ?? undefined,
            createdAt: shipment.createdAt,
            updatedAt: shipment.updatedAt,
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