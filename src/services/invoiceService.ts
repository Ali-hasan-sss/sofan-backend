import { invoiceCreateSchema } from "../validators/invoiceSchemas";
import { InvoiceModel } from "../models/Invoice";
import { ROLES, Role } from "../types/roles";

export const invoiceService = {
  list: async ({
    country,
    userId,
    role,
  }: {
    country?: string;
    userId?: string;
    role?: string;
  }) => {
    const query: Record<string, unknown> = {};
    if (country) query.country = country;
    if (
      role &&
      (role === ROLES.USER_BUSINESS || role === ROLES.USER_PERSONAL) &&
      userId
    ) {
      query.user = userId;
    }
    const invoices = await InvoiceModel.find(query).lean();
    return invoices.map((invoice) => ({
      id: invoice._id.toString(),
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      status: invoice.status,
      issuedAt: invoice.issuedAt,
    }));
  },

  getById: async (id: string) => {
    const invoice = await InvoiceModel.findById(id).lean();
    if (!invoice) {
      const error = new Error("Invoice not found");
      (error as Error & { status?: number }).status = 404;
      throw error;
    }
    return invoice;
  },

  create: async (payload: unknown) => {
    const data = invoiceCreateSchema.parse(payload);
    const sequence = Date.now();
    const invoiceNumber = `INV-${sequence}`;
    const invoice = await InvoiceModel.create({
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
