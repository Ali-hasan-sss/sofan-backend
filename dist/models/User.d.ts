import { Document, Types } from "mongoose";
import { Role } from "../types/roles";
export type UserStatus = "pending" | "approved" | "rejected";
export interface UserDocument extends Document {
    email: string;
    passwordHash: string;
    firstName: string;
    lastName: string;
    phone?: string;
    role: Role;
    locale: "ar" | "en";
    country: string;
    shippingCode?: string;
    branch?: Types.ObjectId;
    status: UserStatus;
    businessName?: string;
    wallet?: Types.ObjectId;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UserModel: import("mongoose").Model<UserDocument, {}, {}, {}, Document<unknown, {}, UserDocument, {}, {}> & UserDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=User.d.ts.map