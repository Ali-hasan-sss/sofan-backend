import { NextFunction, Request, Response } from "express";
import { Role } from "../types/roles";
export declare const requireRoles: (...roles: Role[]) => (req: Request, res: Response, next: NextFunction) => void | Response<any, Record<string, any>>;
//# sourceMappingURL=rbac.d.ts.map