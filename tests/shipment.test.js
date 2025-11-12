"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const shipmentService_1 = require("../src/services/shipmentService");
const PricingRule_1 = require("../src/models/PricingRule");
const User_1 = require("../src/models/User");
const Wallet_1 = require("../src/models/Wallet");
const Shipment_1 = require("../src/models/Shipment");
describe("Shipment Service", () => {
    beforeEach(async () => {
        await Promise.all([
            PricingRule_1.PricingRuleModel.deleteMany({}),
            User_1.UserModel.deleteMany({}),
            Wallet_1.WalletModel.deleteMany({}),
            Shipment_1.ShipmentModel.deleteMany({}),
        ]);
    });
    it("creates shipment with pricing and wallet hold transaction", async () => {
        const pricingRule = await PricingRule_1.PricingRuleModel.create({
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
        const user = await User_1.UserModel.create({
            email: "user@test.com",
            passwordHash: "hash",
            firstName: "Test",
            lastName: "User",
            role: "USER_BUSINESS",
            status: "approved",
            country: "LB",
            locale: "en",
        });
        await Wallet_1.WalletModel.create({
            user: user._id,
            balance: 0,
            currency: "USD",
            transactions: [],
        });
        const result = await shipmentService_1.shipmentService.create({
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
        const shipment = await Shipment_1.ShipmentModel.findById(result.id);
        expect(shipment).not.toBeNull();
        expect(shipment?.pricing.total).toBeGreaterThan(0);
        const wallet = await Wallet_1.WalletModel.findOne({ user: user._id });
        expect(wallet?.transactions).toHaveLength(1);
        expect(wallet?.transactions[0].type).toBe("hold");
        expect(wallet?.transactions[0].amount).toBe(75);
    });
});
//# sourceMappingURL=shipment.test.js.map