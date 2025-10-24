import { Request, Response } from "express";
import { HTTP } from "../../../constants/http";

type Loan = {
    id: string;
    applicant: string;
    amount: number;
    status: "pending" | "under_review" | "approved";
};

const loans = new Map<string, Loan>();

export function createLoan(req: Request, res: Response) {
const { applicant, amount } = req.body ?? {};
if (!applicant || typeof amount !== "number") {
    return res.status(HTTP.BAD_REQUEST).json({ error: "applicant (string) and amount (number) are required" });
}

    const id = String(Date.now());
    const loan: Loan = { id, applicant, amount, status: "pending" };
    loans.set(id, loan);
    return res.status(HTTP.CREATED).json({ data: loan });
}

export function getLoans(_req: Request, res: Response) {
    return res.status(HTTP.OK).json({ data: Array.from(loans.values()) });
}

export function getLoanById(req: Request, res: Response) {
    const loan = loans.get(req.params.id);
    if (!loan) return res.status(HTTP.NOT_FOUND).json({ error: "Not Found" });
    return res.status(HTTP.OK).json({ data: loan });
}

export function updateLoan(req: Request, res: Response) {
    const loan = loans.get(req.params.id);
    if (!loan) return res.status(HTTP.NOT_FOUND).json({ error: "Not Found" });

    const { applicant, amount, status } = req.body ?? {};
    const updated: Loan = {
        ...loan,
        ...(applicant !== undefined ? { applicant } : {}),
        ...(amount !== undefined ? { amount } : {}),
        ...(status !== undefined ? { status } : {}),
    };
    loans.set(req.params.id, updated);
    return res.status(HTTP.OK).json({ data: updated });
}

export function deleteLoan(req: Request, res: Response) {
    loans.delete(req.params.id);
    return res.status(HTTP.NO_CONTENT).send();
}

export function reviewLoan(req: Request, res: Response) {
    const loan = loans.get(req.params.id);
    if (!loan) return res.status(HTTP.NOT_FOUND).json({ error: "Not Found" });
    const updated: Loan = { ...loan, status: "under_review" };
    loans.set(req.params.id, updated);
  return res.status(HTTP.OK).json({ data: updated });
}

export function approveLoan(req: Request, res: Response) {
    const loan = loans.get(req.params.id);
    if (!loan) return res.status(HTTP.NOT_FOUND).json({ error: "Not Found" });
    const updated: Loan = { ...loan, status: "approved" };
    loans.set(req.params.id, updated);
    return res.status(HTTP.OK).json({ data: updated });
}
