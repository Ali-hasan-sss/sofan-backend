import mongoose from "mongoose";
import { ShipmentModel } from "../models/Shipment";
import { PricingRuleModel } from "../models/PricingRule";
import { WalletModel } from "../models/Wallet";
import {
  shipmentCreateSchema,
  shipmentFilterSchema,
} from "../validators/shipmentSchemas";
import { calculatePricing } from "../utils/pricing";
import { generateShipmentNumber } from "../utils/shipmentNumber";

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

      const rule = payload.pricingRuleId
        ? await PricingRuleModel.findById(payload.pricingRuleId).session(
            session
          )
        : await PricingRuleModel.findOne({ country }).session(session);

      if (!rule) {
        const error = new Error("Pricing rule not found");
        (error as Error & { status?: number }).status = 404;
        throw error;
      }

      const packages = payload.packages.map((pkg) => ({
        ...pkg,
        volumetricWeight: Number(
          (
            (pkg.length * pkg.width * pkg.height) /
            rule.volumetricDivisor
          ).toFixed(2)
        ),
      }));

      const pricing = calculatePricing(rule, {
        packages,
        codAmount: payload.codAmount,
        insured: payload.insured,
      });

      const shipmentNumber = await generateShipmentNumber(country);

      const shipment = await ShipmentModel.create(
        [
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
