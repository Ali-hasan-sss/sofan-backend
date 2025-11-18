import { Request, Response } from "express";
export declare const UserController: {
    list: (req: Request, res: Response) => Promise<void>;
    listStaff: (_req: Request, res: Response) => Promise<void>;
    create: (req: Request, res: Response) => Promise<void>;
    listPending: (req: Request, res: Response) => Promise<void>;
    approve: (req: Request, res: Response) => Promise<void>;
    reject: (req: Request, res: Response) => Promise<void>;
    disable: (req: Request, res: Response) => Promise<void>;
    activate: (req: Request, res: Response) => Promise<void>;
    update: (req: Request, res: Response) => Promise<void>;
    remove: (req: Request, res: Response) => Promise<void>;
    updateProfile: (req: Request, res: Response) => Promise<void>;
    changePassword: (req: Request, res: Response) => Promise<void>;
    getDashboardOverview: (req: Request, res: Response) => Promise<void>;
    deleteMyAccount: (req: Request, res: Response) => Promise<Response<any, Record<string, any>> | undefined>;
};
//# sourceMappingURL=userController.d.ts.map