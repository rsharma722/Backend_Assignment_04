import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP } from "../../../constants/http";


export async function getUserById(req: Request, res: Response, next: NextFunction) {
try {
    const { uid } = req.params;
    if (!uid) return res.status(HTTP.BAD_REQUEST).json({ error: "uid param required" });

    const user = await auth.getUser(uid);
    res.status(HTTP.OK).json({ data: user });
} catch (err) {
    next(err);
}
}

export function getUserProfile(_req: Request, res: Response) {
res.status(HTTP.NOT_IMPLEMENTED).json({ error: "profile endpoint secured in Step 7" });
}
