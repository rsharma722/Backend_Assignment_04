import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { AuthenticationError } from "../errors/errors";
import { getErrorMessage, getErrorCode } from "../utils/errorUtils";

const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const header = req.headers.authorization;
    const token = header?.startsWith("Bearer ") ? header.split(" ")[1] : undefined;

    if (!token) {
      return next(new AuthenticationError("Missing token", "TOKEN_NOT_FOUND"));
    }

    const decoded = await auth.verifyIdToken(token);
    res.locals.uid = decoded.uid;
    res.locals.role = (decoded as any).role || null;

    next();
  } catch (err) {
    next(
      new AuthenticationError(
        `Invalid or expired token: ${getErrorMessage(err)}`,
        getErrorCode(err)
      )
    );
  }
};

export default authenticate;
