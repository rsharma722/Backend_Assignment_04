import { Router } from "express";
import { getUserById, getUserProfile } from "../controllers/users.controller";

const router = Router();

router.get("/profile", getUserProfile);
router.get("/:uid", getUserById);

export default router;
