export declare const authService: {
    checkEmailAvailability: (payload: unknown) => Promise<{
        available: boolean;
    }>;
    sendVerificationCode: (payload: unknown) => Promise<{
        sent: boolean;
        code: string;
        expiresAt: Date;
    }>;
    verifyVerificationCode: (payload: unknown) => Promise<{
        verificationToken: `${string}-${string}-${string}-${string}-${string}`;
    }>;
    getProfile: (userId: string) => Promise<{
        id: any;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../types/roles").Role;
        status: import("../models/User").UserStatus;
        country: string;
        branch: import("mongoose").Types.ObjectId | undefined;
        locale: "ar" | "en";
        isActive: boolean;
    }>;
    register: (payload: unknown) => Promise<{
        id: any;
        email: string;
        firstName: string;
        lastName: string;
        role: import("../types/roles").Role;
        status: import("../models/User").UserStatus;
        country: string;
        branch: import("mongoose").Types.ObjectId | undefined;
        locale: "ar" | "en";
        isActive: boolean;
    }>;
    login: (payload: unknown) => Promise<{
        accessToken: string;
        refreshToken: string;
        user: {
            id: any;
            email: string;
            firstName: string;
            lastName: string;
            role: import("../types/roles").Role;
            status: import("../models/User").UserStatus;
            country: string;
            branch: import("mongoose").Types.ObjectId | undefined;
            locale: "ar" | "en";
            isActive: boolean;
        };
    }>;
    refresh: (payload: unknown) => Promise<{
        accessToken: string;
        refreshToken: string;
    }>;
};
//# sourceMappingURL=authService.d.ts.map