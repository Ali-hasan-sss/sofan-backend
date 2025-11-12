import { NextFunction, Request, Response } from "express";
export declare const asyncHandler: <T extends Request, U extends Response>(handler: (req: T, res: U, next: NextFunction) => Promise<void | unknown>) => (req: T, res: U, next: NextFunction) => void;
//# sourceMappingURL=asyncHandler.d.ts.map