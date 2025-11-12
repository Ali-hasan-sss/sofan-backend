import { ShipmentCounterModel } from "../models/ShipmentCounter";

export const generateShipmentNumber = async (countryCode: string) => {
  const counter = await ShipmentCounterModel.findOneAndUpdate(
    { country: countryCode },
    { $inc: { seq: 1 } },
    { upsert: true, new: true }
  );

  const seq = counter.seq.toString().padStart(6, "0");
  return `${countryCode}${seq}`;
};
