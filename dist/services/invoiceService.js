"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.invoiceService = void 0;
const invoiceSchemas_1 = require("../validators/invoiceSchemas");
const Invoice_1 = require("../models/Invoice");
const roles_1 = require("../types/roles");
exports.invoiceService = {
    list: async ({ country, userId, role, }) => {
        const query = {};
        if (country)
            query.country = country;
        if (role &&
            (role === roles_1.ROLES.USER_BUSINESS || role === roles_1.ROLES.USER_PERSONAL) &&
            userId) {
            query.user = userId;
        }
        const invoices = await Invoice_1.InvoiceModel.find(query).lean();
        return invoices.map((invoice) => ({
            id: invoice._id.toString(),
            invoiceNumber: invoice.invoiceNumber,
            totalAmount: invoice.totalAmount,
            currency: invoice.currency,
            status: invoice.status,
            issuedAt: invoice.issuedAt,
        }));
    },
    getById: async (id) => {
        const invoice = await Invoice_1.InvoiceModel.findById(id).lean();
        if (!invoice) {
            const error = new Error("Invoice not found");
            error.status = 404;
            throw error;
        }
        return invoice;
    },
    create: async (payload) => {
        const data = invoiceSchemas_1.invoiceCreateSchema.parse(payload);
        const sequence = Date.now();
        const invoiceNumber = `INV-${sequence}`;
        const invoice = await Invoice_1.InvoiceModel.create({
            ...data,
            invoiceNumber,
            status: "issued",
            issuedAt: new Date(),
        });
        return {
            id: invoice.id.toString(),
            invoiceNumber: invoice.invoiceNumber,
            status: invoice.status,
            totalAmount: invoice.totalAmount,
            currency: invoice.currency,
        };
    },
};
//# sourceMappingURL=invoiceService.js.map