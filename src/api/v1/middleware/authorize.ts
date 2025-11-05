import { Request, Response, NextFunction } from "express";
import { AuthorizationError } from "../errors/errors";

export function authorize(allowedRoles: string[], allowSameUser = false) {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = res.locals.role;
    const userId = res.locals.uid;
    const targetId = req.params.uid;

    if (allowSameUser && userId === targetId) {
      return next();
    }

    if (!allowedRoles.includes(userRole)) {
      return next(new AuthorizationError("Access denied", "FORBIDDEN_ACCESS"));
    }

    next();
  };
}
