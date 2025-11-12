import { PricingRuleModel } from "../src/models/PricingRule";
import { pricingService } from "../src/services/pricingService";

describe("Pricing Service", () => {
  beforeEach(async () => {
    await PricingRuleModel.deleteMany({});
  });

  it("calculates pricing using volumetric weight and COD/insurance fees", async () => {
    await PricingRuleModel.create({
      country: "LB",
      currency: "USD",
      volumetricDivisor: 5000,
      pickupFee: 5,
      deliveryFee: 7,
      codFeePercent: 2,
      codFeeFlat: 1,
      insuranceRatePercent: 1.5,
      baseRate: 10,
      weightRanges: [{ min: 0, max: 50, ratePerKg: 2 }],
    });

    const result = await pricingService.calculate({
      payload: {
        packages: [
          {
            length: 100,
            width: 50,
            height: 40,
            weight: 8,
          },
        ],
        codAmount: 50,
        insured: true,
      },
      country: "LB",
    });

    expect(result.total).toBe(105);
    expect(result.volumetricWeight).toBe(40);
    expect(result.codFee).toBe(2);
    expect(result.insuranceFee).toBe(1);
  });
});
