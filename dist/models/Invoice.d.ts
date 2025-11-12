import { Document, Types } from "mongoose";
export interface InvoiceLineItem {
    shipment: Types.ObjectId;
    description: string;
    amount: number;
    currency: string;
}
export type InvoiceStatus = "draft" | "issued" | "paid" | "overdue";
export interface InvoiceDocument extends Document {
    invoiceNumber: string;
    user: Types.ObjectId;
    branch?: Types.ObjectId;
    country: string;
    lineItems: InvoiceLineItem[];
    totalAmount: number;
    currency: string;
    status: InvoiceStatus;
    issuedAt?: Date;
    dueAt?: Date;
    pdfUrl?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const InvoiceModel: import("mongoose").Model<InvoiceDocument, {}, {}, {}, Document<unknown, {}, InvoiceDocument, {}, {}> & InvoiceDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Invoice.d.ts.map