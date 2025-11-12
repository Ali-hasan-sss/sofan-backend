import { shipmentService } from "../src/services/shipmentService";
import { PricingRuleModel } from "../src/models/PricingRule";
import { UserModel } from "../src/models/User";
import { WalletModel } from "../src/models/Wallet";
import { ShipmentModel } from "../src/models/Shipment";

describe("Shipment Service", () => {
  beforeEach(async () => {
    await Promise.all([
      PricingRuleModel.deleteMany({}),
      UserModel.deleteMany({}),
      WalletModel.deleteMany({}),
      ShipmentModel.deleteMany({}),
    ]);
  });

  it("creates shipment with pricing and wallet hold transaction", async () => {
    const pricingRule = await PricingRuleModel.create({
      country: "LB",
      currency: "USD",
      volumetricDivisor: 5000,
      pickupFee: 3,
      deliveryFee: 4,
      codFeePercent: 1,
      codFeeFlat: 1,
      insuranceRatePercent: 1,
      baseRate: 5,
      weightRanges: [{ min: 0, max: 100, ratePerKg: 1 }],
    });

    const user = await UserModel.create({
      email: "user@test.com",
      passwordHash: "hash",
      firstName: "Test",
      lastName: "User",
      role: "USER_BUSINESS",
      status: "approved",
      country: "LB",
      locale: "en",
    });

    await WalletModel.create({
      user: user._id,
      balance: 0,
      currency: "USD",
      transactions: [],
    });

    const result = await shipmentService.create({
      data: {
        type: "door_to_door",
        sender: {
          name: "Sender",
          phone: "123456",
          address: "Sender Address",
        },
        recipient: {
          name: "Recipient",
          phone: "654321",
          address: "Recipient Address",
        },
        packages: [
          {
            length: 50,
            width: 40,
            height: 30,
            weight: 10,
            declaredValue: { amount: 100, currency: "USD" },
            goodsType: "electronics",
          },
        ],
        codAmount: 75,
        codCurrency: "USD",
        pricingRuleId: pricingRule._id.toString(),
      },
      createdBy: user._id.toString(),
      country: "LB",
    });

    expect(result.shipmentNumber).toMatch(/^LB\d{6}$/);

    const shipment = await ShipmentModel.findById(result.id);
    expect(shipment).not.toBeNull();
    expect(shipment?.pricing.total).toBeGreaterThan(0);

    const wallet = await WalletModel.findOne({ user: user._id });
    expect(wallet?.transactions).toHaveLength(1);
    expect(wallet?.transactions[0].type).toBe("hold");
    expect(wallet?.transactions[0].amount).toBe(75);
  });
});
