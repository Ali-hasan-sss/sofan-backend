import { Types } from "mongoose";
import { CountryModel, CountryDocument } from "../models/Country";
import {
  countryCreateSchema,
  countryUpdateSchema,
} from "../validators/countrySchemas";
import { NotFoundError } from "../errors/NotFoundError";

const mapCountry = (doc: CountryDocument) => ({
  id: (doc._id as Types.ObjectId).toString(),
  name: doc.name,
  code: doc.code,
  createdAt: doc.createdAt,
  updatedAt: doc.updatedAt,
});

export const countryService = {
  list: async () => {
    const countries = await CountryModel.find().sort({ name: 1 }).exec();
    return countries.map(mapCountry);
  },

  create: async (payload: unknown) => {
    const data = countryCreateSchema.parse(payload);
    const country = await CountryModel.create({
      name: data.name.trim(),
      code: data.code.trim().toUpperCase(),
    });
    return mapCountry(country);
  },

  update: async (id: string, payload: unknown) => {
    const data = countryUpdateSchema.parse(payload);
    const country = await CountryModel.findById(id);
    if (!country) {
      throw new NotFoundError("Country not found");
    }

    if (data.name !== undefined) {
      country.name = data.name.trim();
    }
    if (data.code !== undefined) {
      country.code = data.code.trim().toUpperCase();
    }

    await country.save();
    return mapCountry(country);
  },

  remove: async (id: string) => {
    const country = await CountryModel.findById(id);
    if (!country) {
      throw new NotFoundError("Country not found");
    }
    await country.deleteOne();
    return { success: true };
  },
};
