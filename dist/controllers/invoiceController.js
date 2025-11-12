"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.InvoiceController = void 0;
const invoiceService_1 = require("../services/invoiceService");
exports.InvoiceController = {
    list: async (req, res) => {
        const invoices = await invoiceService_1.invoiceService.list({
            country: req.user?.country,
            userId: req.user?.id,
            role: req.user?.roles?.[0],
        });
        res.json(invoices);
    },
    getById: async (req, res) => {
        const invoice = await invoiceService_1.invoiceService.getById(req.params.id);
        res.json(invoice);
    },
    create: async (req, res) => {
        const invoice = await invoiceService_1.invoiceService.create(req.body);
        res.status(201).json(invoice);
    },
};
//# sourceMappingURL=invoiceController.js.map