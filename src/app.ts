import express from "express";
import loansRouter from "./api/v1/routes/loans.routes";
import errorHandler, { notFound } from "./api/v1/middleware/errorHandler";
import { applyLogging } from "./api/v1/middleware/logger";

const app = express();

applyLogging(app);

app.use(express.json());

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/loans", loansRouter);
app.use(notFound);
app.use(errorHandler);

export default app;