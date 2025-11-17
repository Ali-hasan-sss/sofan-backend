"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateUserShippingCode = void 0;
const UserShippingCodeCounter_1 = require("../models/UserShippingCodeCounter");
/**
 * Generates a unique shipping code for a user
 * Format: {countryCode}{4-digit-sequence}
 * Example: LB0001, US0001, etc.
 */
const generateUserShippingCode = async (countryCode) => {
    // Ensure country code is uppercase and 2 characters
    const normalizedCountryCode = countryCode.toUpperCase().slice(0, 2);
    const counter = await UserShippingCodeCounter_1.UserShippingCodeCounterModel.findOneAndUpdate({ country: normalizedCountryCode }, { $inc: { seq: 1 } }, { upsert: true, new: true });
    const seq = counter.seq.toString().padStart(4, "0");
    return `${normalizedCountryCode}${seq}`;
};
exports.generateUserShippingCode = generateUserShippingCode;
//# sourceMappingURL=userShippingCode.js.map