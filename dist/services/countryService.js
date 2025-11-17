"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.countryService = void 0;
const Country_1 = require("../models/Country");
const countrySchemas_1 = require("../validators/countrySchemas");
const NotFoundError_1 = require("../errors/NotFoundError");
const mapCountry = (doc) => ({
    id: doc._id.toString(),
    name: doc.name,
    code: doc.code,
    phoneCode: doc.phoneCode,
    iso3: doc.iso3,
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
});
exports.countryService = {
    list: async () => {
        const countries = await Country_1.CountryModel.find().sort({ name: 1 }).exec();
        return countries.map(mapCountry);
    },
    create: async (payload) => {
        const data = countrySchemas_1.countryCreateSchema.parse(payload);
        const country = await Country_1.CountryModel.create({
            name: data.name.trim(),
            code: data.code.trim().toUpperCase(),
            phoneCode: data.phoneCode?.trim(),
            iso3: data.iso3?.trim().toUpperCase(),
        });
        return mapCountry(country);
    },
    update: async (id, payload) => {
        const data = countrySchemas_1.countryUpdateSchema.parse(payload);
        const country = await Country_1.CountryModel.findById(id);
        if (!country) {
            throw new NotFoundError_1.NotFoundError("Country not found");
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
    remove: async (id) => {
        const country = await Country_1.CountryModel.findById(id);
        if (!country) {
            throw new NotFoundError_1.NotFoundError("Country not found");
        }
        await country.deleteOne();
        return { success: true };
    },
};
//# sourceMappingURL=countryService.js.map