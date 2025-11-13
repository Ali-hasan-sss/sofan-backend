import mongoose from "mongoose";
import { ShipmentModel } from "../models/Shipment";
import { WalletModel } from "../models/Wallet";
import {
  shipmentCreateSchema,
  shipmentFilterSchema,
} from "../validators/shipmentSchemas";
import { calculatePricing } from "../utils/pricing";
import { generateShipmentNumber } from "../utils/shipmentNumber";
import { locationService } from "./locationService";
import { VolumeRateModel } from "../models/VolumeRate";

type ListParams = {
  country?: string;
  branch?: string;
  status?: string;
};

export const shipmentService = {
  list: async (filters: ListParams) => {
    const filter = shipmentFilterSchema.parse(filters);
    const query: Record<string, unknown> = {};
    if (filter.country) query.country = filter.country;
    if (filter.branch)
      query.$or = [{ branchFrom: filter.branch }, { branchTo: filter.branch }];
    if (filter.status) query.status = filter.status;

    const shipments = await ShipmentModel.find(query)
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

  create: async ({
    data,
    createdBy,
    country,
  }: {
    data: unknown;
    createdBy: string;
    country: string;
  }) => {
    const session = await mongoose.startSession();
    try {
      session.startTransaction();

      const payload = shipmentCreateSchema.parse(data);

      const packages = payload.packages.map((pkg) => ({
        ...pkg,
        volumetricWeight: Number(
          ((pkg.length * pkg.width * pkg.height) / 1_000_000).toFixed(4)
        ),
      }));
      const originBranchId = payload.branchFrom;

      const toObjectId = (value?: string) =>
        value ? new mongoose.Types.ObjectId(value) : undefined;

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

      const recipientBranchId =
        payload.branchTo ??
        (await locationService
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
        const error = new Error(
          "Unable to resolve source and destination branches for pricing"
        );
        (error as Error & { status?: number }).status = 400;
        throw error;
      }

      const rate = await VolumeRateModel.findOne({
        originBranch: originBranchId,
        destinationBranch: destinationBranchId,
        isActive: true,
      }).session(session);

      if (!rate) {
        const error = new Error(
          "Pricing rate not configured for the selected branches"
        );
        (error as Error & { status?: number }).status = 404;
        throw error;
      }

      const pricingCurrency = payload.pricingCurrency.toUpperCase();

      const pricing = calculatePricing(rate, {
        packages: packages.map((pkg) => ({
          length: pkg.length,
          width: pkg.width,
          height: pkg.height,
        })),
        shipmentType: payload.type,
        currency: pricingCurrency,
      });

      const shipmentNumber = await generateShipmentNumber(country);

      const shipment = await ShipmentModel.create(
        [
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
        ],
        { session }
      );

      if (payload.codAmount && payload.codAmount > 0) {
        const wallet = await WalletModel.findOne({ user: createdBy }).session(
          session
        );
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
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  },

  getById: async (id: string) => {
    const shipment = await ShipmentModel.findById(id)
      .populate("branchFrom", "name code")
      .populate("branchTo", "name code")
      .lean();
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const mapAddress = (address: typeof shipment.sender) => ({
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

  getByNumber: async (shipmentNumber: string) => {
    const shipment = await ShipmentModel.findOne({ shipmentNumber })
      .populate("branchFrom", "name code")
      .populate("branchTo", "name code")
      .lean();
    if (!shipment) {
      const error = new Error("Shipment not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const mapAddress = (address: typeof shipment.sender) => ({
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
