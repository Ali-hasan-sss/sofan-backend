import {
  pricingCalcSchema,
  pricingRuleSchema,
} from "../validators/pricingSchemas";
import { PricingRuleModel } from "../models/PricingRule";
import { calculatePricing } from "../utils/pricing";

export const pricingService = {
  calculate: async ({
    payload,
    country,
  }: {
    payload: unknown;
    country: string;
  }) => {
    const data = pricingCalcSchema.parse(payload);

    const rule = data.pricingRuleId
      ? await PricingRuleModel.findById(data.pricingRuleId)
      : await PricingRuleModel.findOne({ country });

    if (!rule) {
      const error = new Error("Pricing rule not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }

    const pricing = calculatePricing(rule, {
      packages: data.packages.map((pkg) => ({
        ...pkg,
        declaredValue: { amount: 0, currency: rule.currency },
        goodsType: "general",
      })),
      codAmount: data.codAmount,
      insured: data.insured,
    });

    return pricing;
  },

  listRules: async (country?: string) => {
    const query = country ? { country } : {};
    const rules = await PricingRuleModel.find(query).lean();
    return rules.map((rule) => ({
      id: rule._id.toString(),
      country: rule.country,
      currency: rule.currency,
      volumetricDivisor: rule.volumetricDivisor,
      baseRate: rule.baseRate,
    }));
  },

  createRule: async (payload: unknown) => {
    const data = pricingRuleSchema.parse(payload);
    const rule = await PricingRuleModel.create(data);
    return {
      id: rule.id.toString(),
      country: rule.country,
      currency: rule.currency,
      volumetricDivisor: rule.volumetricDivisor,
      baseRate: rule.baseRate,
    };
  },
};
