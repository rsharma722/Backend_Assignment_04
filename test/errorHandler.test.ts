import request from "supertest";
import express from "express";
import errorHandler, { notFound } from "../src/api/v1/middleware/errorHandler";
import { ServiceError } from "../src/api/v1/errors/errors";
import { HTTP } from "../src/constants/http";

describe("Global Error Handler", () => {
test("handles a known AppError (ServiceError)", async () => {
    const app = express();
    app.get("/fail", () => {
    throw new ServiceError("Invalid loan", "BUSINESS_RULE", HTTP.UNPROCESSABLE_ENTITY);
    });
    app.use(errorHandler);

    const res = await request(app).get("/fail");

    expect(res.status).toBe(HTTP.UNPROCESSABLE_ENTITY);
    expect(res.body.success).toBe(false);
    expect(res.body.error).toEqual({
    message: "Invalid loan",
    code: "BUSINESS_RULE",
    });
    expect(typeof res.body.timestamp).toBe("string");
});

test("handles unknown errors as 500", async () => {
    const app = express();
    app.get("/boom", () => {
    throw new Error("Unexpected crash");
    });
    app.use(errorHandler);

    const res = await request(app).get("/boom");

    expect(res.status).toBe(HTTP.INTERNAL_SERVER_ERROR);
    expect(res.body.error.code).toBe("UNKNOWN_ERROR");
});

test("handles 404 via notFound middleware", async () => {
    const app = express();
    app.use(notFound);
    app.use(errorHandler);

    const res = await request(app).get("/nothing");

    expect(res.status).toBe(HTTP.NOT_FOUND);
    expect(res.body.error.code).toBe("NOT_FOUND");
});
});