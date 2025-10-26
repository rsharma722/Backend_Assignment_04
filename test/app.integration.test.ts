jest.mock("fs", () => ({
existsSync: jest.fn(() => true),
mkdirSync: jest.fn(),
createWriteStream: jest.fn(() => ({ write: jest.fn() })),
appendFileSync: jest.fn(),
}));

jest.mock("../src/config/firebaseConfig", () => ({
auth: {
    verifyIdToken: jest.fn(), 
},
}));

import request from "supertest";
import app from "../src/app";
import { HTTP } from "../src/constants/http";
import { auth } from "../src/config/firebaseConfig";

describe("Integration Tests (App + Middleware + Routes)", () => {
beforeEach(() => {
    jest.clearAllMocks();
});


const asAdmin = () => {
(auth.verifyIdToken as jest.Mock).mockImplementation((token: string) => {
    if (token === "admin-token") {
    return Promise.resolve({
        uid: "admin1",
        role: "admin",                   
        customClaims: { role: "admin" },  
    });
    }
    return Promise.reject(new Error("invalid token"));
});
};

const asUser = () => {
(auth.verifyIdToken as jest.Mock).mockImplementation((token: string) => {
    if (token === "user-token") {
    return Promise.resolve({
        uid: "user1",
        role: "user",                    
        customClaims: { role: "user" },   
    });
    }
    return Promise.reject(new Error("invalid token"));
});
};


const asInvalid = () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("bad token"));
};

test("GET /health → 200 OK", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(HTTP.OK);
    expect(res.body).toEqual({ ok: true });
});

test("GET /loans → 200 for admin", async () => {
    asAdmin();
    const res = await request(app)
    .get("/api/v1/loans")
    .set("Authorization", "Bearer admin-token");
    expect(res.status).toBe(HTTP.OK);
});

test("POST /loans → 201 for admin", async () => {
    asAdmin();
    const res = await request(app)
    .post("/api/v1/loans")
    .set("Authorization", "Bearer admin-token")
    .send({ applicant: "Jane", amount: 1000 });
    expect(res.status).toBe(HTTP.CREATED);
});

test("GET /loans → 401 if no token", async () => {
    const res = await request(app).get("/api/v1/loans");
    expect(res.status).toBe(HTTP.UNAUTHORIZED);
});

test("GET /loans → 401 if token invalid", async () => {
    asInvalid();
    const res = await request(app)
    .get("/api/v1/loans")
    .set("Authorization", "Bearer invalid");
    expect(res.status).toBe(HTTP.UNAUTHORIZED);
});

test("POST /loans → 403 if user has no access", async () => {
    asUser();
    const res = await request(app)
    .post("/api/v1/loans")
    .set("Authorization", "Bearer user-token")
    .send({ applicant: "User", amount: 100 });
    expect(res.status).toBe(HTTP.FORBIDDEN);
});

test("GET unknown route → 404", async () => {
    const res = await request(app).get("/api/v1/unknown");
    expect(res.status).toBe(HTTP.NOT_FOUND);
});
});
