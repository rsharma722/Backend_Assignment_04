import { Router } from "express";
import { getUserById, getUserProfile } from "../controllers/users.controller";
import authenticate from "../middleware/authenticate";
import { authorize } from "../middleware/authorize";

const router = Router();

router.get("/:uid", authenticate, authorize(["admin"]), getUserById);
router.get("/profile", authenticate, authorize(["admin", "manager", "staff", "user"], true), getUserProfile);

export default router;
