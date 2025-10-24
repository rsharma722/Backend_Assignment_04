import morgan from "morgan";
import fs from "fs";
import path from "path";

const logDir = path.join(process.cwd(), "logs");

if (!fs.existsSync(logDir)) {
fs.mkdirSync(logDir);
}

const accessLog = fs.createWriteStream(path.join(logDir, "access.log"), { flags: "a" });
const errorLog = fs.createWriteStream(path.join(logDir, "error.log"), { flags: "a" });

export const devLogger = morgan("dev");

export const accessLogger = morgan("combined", { stream: accessLog });

export const errorLogger = morgan("combined", {
stream: errorLog,
skip: (_req, res) => res.statusCode < 400,
});

export function applyLogging(app: import("express").Express) {
const env = process.env.NODE_ENV || "development";

if (env === "production") {
    app.use(accessLogger);
    app.use(errorLogger);
} else {
    app.use(devLogger);
}
}
