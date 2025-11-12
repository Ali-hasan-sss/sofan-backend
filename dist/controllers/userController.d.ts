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
    remove: (req: Request, res: Response) => Promise<void>;
};
//# sourceMappingURL=userController.d.ts.map