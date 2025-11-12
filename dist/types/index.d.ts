export type Locale = "ar" | "en";
export type Money = {
    amount: number;
    currency: string;
};
export type Dimensions = {
    length: number;
    width: number;
    height: number;
    weight: number;
    declaredValue: Money;
    goodsType: string;
};
export type ShipmentType = "door_to_door" | "branch_to_branch" | "branch_to_door" | "door_to_branch";
//# sourceMappingURL=index.d.ts.map