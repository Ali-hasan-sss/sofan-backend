import { type Document } from "mongoose";
export interface EmailVerificationDocument extends Document {
    email: string;
    code: string;
    expiresAt: Date;
    verifiedAt?: Date | null;
    verificationToken?: string;
    createdAt: Date;
    updatedAt: Date;
}
export declare const EmailVerificationModel: import("mongoose").Model<EmailVerificationDocument, {}, {}, {}, Document<unknown, {}, EmailVerificationDocument, {}, {}> & EmailVerificationDocument & Required<{
    _id: unknown;
}> & {
    __v: number;
}, any>;
//# sourceMappingURL=EmailVerification.d.ts.map