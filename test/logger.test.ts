import express from "express";
import request from "supertest";

jest.mock("fs", () => ({
existsSync: jest.fn(() => true),
mkdirSync: jest.fn(),
createWriteStream: jest.fn(() => ({ write: jest.fn() })),
appendFileSync: jest.fn(),
}));

import {
applyLogging,
devLogger,
accessLogger,
errorLogger,
} from "../src/api/v1/middleware/logger";

describe("Logging middleware", () => {
const createApp = () => {
    const app = express();
    app.get("/ping", (_req, res) => res.json({ ok: true }));
    return app;
};

test("uses console logger in development", async () => {
    process.env.NODE_ENV = "development";
    const app = createApp();
    const useSpy = jest.spyOn(app, "use");

    applyLogging(app);

    expect(useSpy).toHaveBeenCalledWith(devLogger);

    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
});

test("uses file loggers in production", async () => {
    process.env.NODE_ENV = "production";
    const app = createApp();
    const useSpy = jest.spyOn(app, "use");

    applyLogging(app);

    expect(useSpy).toHaveBeenCalledWith(accessLogger);
    expect(useSpy).toHaveBeenCalledWith(errorLogger);

    const res = await request(app).get("/ping");
    expect(res.status).toBe(200);
});
});
