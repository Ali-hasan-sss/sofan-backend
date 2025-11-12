import { NextFunction, Request, Response } from "express";
import { Role, ROLE_HIERARCHY } from "../types/roles";

export const requireRoles =
  (...roles: Role[]) =>
  (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const userRoles = req.user.roles;

    const hasAccess = userRoles.some((role) => {
      const allowed = ROLE_HIERARCHY[role as Role] ?? [];
      return roles.some((required) => allowed.includes(required));
    });

    if (!hasAccess) {
      return res.status(403).json({ message: "Forbidden" });
    }

    return next();
  };


