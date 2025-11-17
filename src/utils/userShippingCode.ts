import { UserShippingCodeCounterModel } from "../models/UserShippingCodeCounter";

/**
 * Generates a unique shipping code for a user
 * Format: {countryCode}{4-digit-sequence}
 * Example: LB0001, US0001, etc.
 */
export const generateUserShippingCode = async (
  countryCode: string
): Promise<string> => {
  // Ensure country code is uppercase and 2 characters
  const normalizedCountryCode = countryCode.toUpperCase().slice(0, 2);

  const counter = await UserShippingCodeCounterModel.findOneAndUpdate(
    { country: normalizedCountryCode },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  const seq = counter.seq.toString().padStart(4, "0");
  return `${normalizedCountryCode}${seq}`;
};
