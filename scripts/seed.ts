import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { connectMongoose, disconnectMongoose } from "../src/loaders/mongoose";
import { UserModel } from "../src/models/User";
import { BranchModel } from "../src/models/Branch";
import { PricingRuleModel } from "../src/models/PricingRule";
import { ROLES } from "../src/types/roles";
import { env } from "../src/config/env";

const run = async () => {
  await connectMongoose();

  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Admin@1234", salt);

  const superAdmin = await UserModel.findOneAndUpdate(
    { email: "super@sofan.global" },
    {
      email: "super@sofan.global",
      passwordHash,
      firstName: "Super",
      lastName: "Admin",
      role: ROLES.SUPER_ADMIN,
      status: "approved",
      country: env.DEFAULT_COUNTRY,
      locale: "en",
    },
    { upsert: true, new: true }
  );

  const branch = await BranchModel.findOneAndUpdate(
    { code: "HQ" },
    {
      name: "Headquarters",
      country: env.DEFAULT_COUNTRY,
      code: "HQ",
      address: "Main Street",
      contactNumber: "+961123456",
    },
    { upsert: true, new: true }
  );

  await PricingRuleModel.findOneAndUpdate(
    { country: env.DEFAULT_COUNTRY, branch: branch._id },
    {
      country: env.DEFAULT_COUNTRY,
      branch: branch._id,
      currency: "USD",
      volumetricDivisor: 5000,
      pickupFee: 5,
      deliveryFee: 7,
      codFeePercent: 2,
      codFeeFlat: 1,
      insuranceRatePercent: 1.5,
      baseRate: 10,
      weightRanges: [
        { min: 0, max: 5, ratePerKg: 2 },
        { min: 5, max: 20, ratePerKg: 1.5 },
      ],
    },
    { upsert: true, new: true }
  );

  // eslint-disable-next-line no-console
  console.log("Seed completed", {
    superAdmin: superAdmin.email,
    branch: branch.code,
  });

  await disconnectMongoose();
  await mongoose.disconnect();
};

run().catch((error) => {
  // eslint-disable-next-line no-console
  console.error(error);
  process.exit(1);
});
