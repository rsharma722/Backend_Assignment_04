import { Router } from "express";
import {
    createLoan, getLoans, getLoanById, updateLoan,
    deleteLoan, reviewLoan, approveLoan
} from "../controllers/loans.controller";

const router = Router();

router.post("/", createLoan);
router.get("/", getLoans);
router.get("/:id", getLoanById);
router.put("/:id", updateLoan);
router.delete("/:id", deleteLoan);

router.put("/:id/review", reviewLoan);
router.put("/:id/approve", approveLoan);

export default router;
