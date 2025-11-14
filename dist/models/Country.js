"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CountryModel = void 0;
const mongoose_1 = require("mongoose");
const CountrySchema = new mongoose_1.Schema({
    name: { type: String, required: true, trim: true, unique: true },
    code: {
        type: String,
        required: true,
        trim: true,
        uppercase: true,
        unique: true,
    },
}, { timestamps: true });
exports.CountryModel = (0, mongoose_1.model)("Country", CountrySchema);
//# sourceMappingURL=Country.js.map