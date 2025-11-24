import { Document, Types } from "mongoose";
export type ScanType = "pickup" | "arrival_at_branch" | "departure_from_branch" | "delivery";
export interface ScanDocument extends Document {
    shipment: Types.ObjectId;
    scanType: ScanType;
    scannedBy: Types.ObjectId;
    branch?: Types.ObjectId;
    courier?: Types.ObjectId;
    location?: {
        latitude?: number;
        longitude?: number;
        address?: string;
    };
    notes?: string;
    createdAt: Date;
}
export declare const ScanModel: import("mongoose").Model<ScanDocument, {}, {}, {}, Document<unknown, {}, ScanDocument, {}, {}> & ScanDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=Scan.d.ts.map