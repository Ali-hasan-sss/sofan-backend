import { Request, Response } from "express";
export declare const AuthController: {
    me: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
    checkEmail: (req: Request, res: Response) => Promise<void>;
    sendVerificationCode: (req: Request, res: Response) => Promise<void>;
    verifyVerificationCode: (req: Request, res: Response) => Promise<void>;
    register: (req: Request, res: Response) => Promise<void>;
    login: (req: Request, res: Response) => Promise<void>;
    refreshToken: (req: Request, res: Response) => Promise<void>;
    logout: (_req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=authController.d.ts.map