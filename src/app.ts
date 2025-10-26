import express from "express";
import loansRouter from "./api/v1/routes/loans.routes";
import usersRouter from "./api/v1/routes/users.routes";
import adminRouter from "./api/v1/routes/admin.routes";
import errorHandler, { notFound } from "./api/v1/middleware/errorHandler";
import { applyLogging } from "./api/v1/middleware/logger";
import authenticate from "./api/v1/middleware/authenticate";
import { authorize } from "./api/v1/middleware/authorize";

const app = express();

applyLogging(app);

app.use(express.json());

app.get("/api/v1/health", (_req, res) => res.json({ ok: true }));
app.use(
  "/api/v1/loans",
  authenticate,
  authorize(["admin", "manager"]),
  loansRouter
);
app.use("/api/v1/users", authenticate, authorize(["admin"]), usersRouter);
app.use("/api/v1/admin", authenticate, authorize(["admin"]), adminRouter);

app.use(notFound);
app.use(errorHandler);

export default app;
