import { VolumeRateDocument } from "../models/VolumeRate";
import { ShipmentType } from "../types";
export interface VolumePricingInput {
    packages: Array<{
        length: number;
        width: number;
        height: number;
        quantity?: number;
    }>;
    shipmentType: ShipmentType;
    currency?: string;
}
export interface PricingResult {
    baseRate: number;
    weightCharge: number;
    volumetricWeight: number;
    pickupFee: number;
    deliveryFee: number;
    codFee: number;
    insuranceFee: number;
    currency: string;
    localCurrency: string;
    total: number;
}
export declare const calculatePricing: (rate: VolumeRateDocument, input: VolumePricingInput) => PricingResult;
//# sourceMappingURL=pricing.d.ts.map