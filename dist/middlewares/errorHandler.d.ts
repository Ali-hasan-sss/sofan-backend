import { NextFunction, Request, Response } from "express";
interface ApiError extends Error {
    status?: number;
    details?: unknown;
}
export declare const errorHandler: (err: ApiError, _req: Request, res: Response, _next: NextFunction) => Response<any, Record<string, any>>;
export {};
//# sourceMappingURL=errorHandler.d.ts.map