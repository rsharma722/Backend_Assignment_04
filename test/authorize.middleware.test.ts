import express from "express";
import request from "supertest";
import { authorize } from "../src/api/v1/middleware/authorize";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { HTTP } from "../src/constants/http";

const makeApp = (role: string, uid: string) => {
const app = express();

app.use((req, res, next) => {
    res.locals.role = role;
    res.locals.uid = uid;
    next();
});

app.get("/admin", authorize(["admin"]), (_req, res) => {
    res.status(HTTP.OK).json({ message: "Admin access granted" });
});

app.get("/profile/:uid", authorize(["user"], true), (_req, res) => {
    res.status(HTTP.OK).json({ message: "Own profile allowed" });
});

app.use(errorHandler);
return app;
};

describe("Authorization Middleware", () => {
test("lets user in if they have the right role", async () => {
    const app = makeApp("admin", "1");
    const res = await request(app).get("/admin");
    expect(res.status).toBe(HTTP.OK);
    expect(res.body.message).toBe("Admin access granted");
});

test("blocks user if they don't have the right role", async () => {
    const app = makeApp("user", "2");
    const res = await request(app).get("/admin");
    expect(res.status).toBe(HTTP.FORBIDDEN);
    expect(res.body.error.code).toBe("FORBIDDEN_ACCESS");
});

test("allows same-user access when enabled", async () => {
    const app = makeApp("user", "3");
    const res = await request(app).get("/profile/3");
    expect(res.status).toBe(HTTP.OK);
    expect(res.body.message).toBe("Own profile allowed");
});
});
