"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateShipmentNumber = void 0;
const ShipmentCounter_1 = require("../models/ShipmentCounter");
const generateShipmentNumber = async (countryCode) => {
    const counter = await ShipmentCounter_1.ShipmentCounterModel.findOneAndUpdate({ country: countryCode }, { $inc: { seq: 1 } }, { upsert: true, new: true });
    const seq = counter.seq.toString().padStart(6, "0");
    return `${countryCode}${seq}`;
};
exports.generateShipmentNumber = generateShipmentNumber;
//# sourceMappingURL=shipmentNumber.js.map