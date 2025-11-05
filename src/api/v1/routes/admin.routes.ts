import { Router } from "express";
import { setCustomClaims } from "../controllers/admin.controller";

const router = Router();

router.post("/setCustomClaims", setCustomClaims);

export default router;
