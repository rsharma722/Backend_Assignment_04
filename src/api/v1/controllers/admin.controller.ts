import { Request, Response, NextFunction } from "express";
import { auth } from "../../../config/firebaseConfig";
import { HTTP } from "../../../constants/http";


export async function setCustomClaims(req: Request, res: Response, next: NextFunction) {
try {
    const { uid, claims } = req.body;

    if (!uid || !claims) {
    return res
        .status(HTTP.BAD_REQUEST)
        .json({ error: "uid and claims are required" });
    }

    await auth.setCustomUserClaims(uid, claims);

    res.status(HTTP.OK).json({
    message: `Custom claims set for user: ${uid}`,
    claims,
    });
} catch (err) {
    next(err);
}
}
