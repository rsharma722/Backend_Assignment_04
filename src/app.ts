import express from "express";
import morgan from "morgan";
import loansRouter from "./api/v1/routes/loans.routes";
import errorHandler, { notFound } from "./api/v1/middleware/errorHandler";

const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
  res.json({ ok: true });
});

app.use("/api/v1/loans", loansRouter);

app.use(notFound);
app.use(errorHandler);

export default app;