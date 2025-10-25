import express from "express";
import request from "supertest";
import authenticate from "../src/api/v1/middleware/authenticate";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { HTTP } from "../src/constants/http";

jest.mock("../src/config/firebaseConfig", () => ({
auth: { verifyIdToken: jest.fn() },
}));

import { auth } from "../src/config/firebaseConfig";

describe("Authentication Middleware", () => {
const makeApp = () => {
    const app = express();
    app.get("/protected", authenticate, (_req, res) => {
    res.status(HTTP.OK).json({
        uid: res.locals.uid,
        role: res.locals.role,
    });
    });
    app.use(errorHandler);
    return app;
};

beforeEach(() => {
    jest.clearAllMocks();
});

test("returns 200 and attaches uid/role when token is valid", async () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValueOnce({
    uid: "user123",
    role: "admin",
    });

    const res = await request(makeApp())
    .get("/protected")
    .set("Authorization", "Bearer validtoken");

    expect(res.status).toBe(HTTP.OK);
    expect(res.body.uid).toBe("user123");
    expect(res.body.role).toBe("admin");
});

test("returns 401 when token is missing", async () => {
    const res = await request(makeApp()).get("/protected");
    expect(res.status).toBe(HTTP.UNAUTHORIZED);
    expect(res.body.error.code).toBe("TOKEN_NOT_FOUND");
});

test("returns 401 when token is invalid", async () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValueOnce(new Error("bad token"));

    const res = await request(makeApp())
    .get("/protected")
    .set("Authorization", "Bearer wrongtoken");

    expect(res.status).toBe(HTTP.UNAUTHORIZED);
    expect(res.body.error.code).toBe("UNKNOWN_ERROR");
});
});
