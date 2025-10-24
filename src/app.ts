import express from "express";
import morgan from "morgan";
import loansRouter from "./api/v1/routes/loans.routes";
const app = express();

app.use(express.json());
app.use(morgan("dev"));

app.get("/api/v1/health", (_req, res) => {
    res.json({ ok: true });
});

app.use("/api/v1/loans", loansRouter);

app.use((_req, res) => {
    res.status(404).json({ error: "Not Found" });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

export default app;
