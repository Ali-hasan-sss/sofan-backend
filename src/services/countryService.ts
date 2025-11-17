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
  phoneCode: doc.phoneCode,
  iso3: doc.iso3,
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
      phoneCode: data.phoneCode?.trim(),
      iso3: data.iso3?.trim().toUpperCase(),
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
    if (data.phoneCode !== undefined) {
      country.phoneCode = data.phoneCode?.trim() || undefined;
    }
    if (data.iso3 !== undefined) {
      country.iso3 = data.iso3?.trim().toUpperCase() || undefined;
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
