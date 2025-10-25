import express from "express";
import request from "supertest";
import authenticate from "../src/api/v1/middleware/authenticate";
import { authorize } from "../src/api/v1/middleware/authorize";
import loansRouter from "../src/api/v1/routes/loans.routes";
import errorHandler from "../src/api/v1/middleware/errorHandler";
import { HTTP } from "../src/constants/http";

jest.mock("../src/config/firebaseConfig", () => ({
auth: { verifyIdToken: jest.fn() },
}));
import { auth } from "../src/config/firebaseConfig";

jest.mock("fs", () => ({
existsSync: jest.fn(() => true),
mkdirSync: jest.fn(),
createWriteStream: jest.fn(() => ({ write: jest.fn() })),
appendFileSync: jest.fn(),
}));

const makeApp = () => {
const app = express();
app.use(express.json());
app.use("/api/v1/loans", authenticate, authorize(["admin", "manager"]), loansRouter);
app.use(errorHandler);
return app;
};

describe("Secured Loan Endpoints", () => {
const app = makeApp();
const adminToken = "Bearer admin-token";
const userToken = "Bearer user-token";

beforeEach(() => jest.clearAllMocks());

const mockAdmin = () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: "u-admin",
    role: "admin",
    customClaims: { role: "admin" },
    });
};

const mockUser = () => {
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({
    uid: "u-user",
    role: "user",
    customClaims: { role: "user" },
    });
};

const mockInvalid = () => {
    (auth.verifyIdToken as jest.Mock).mockRejectedValue(new Error("bad token"));
};

test("POST /loans → 201 for admin", async () => {
    mockAdmin();
    const res = await request(app)
    .post("/api/v1/loans")
    .set("Authorization", adminToken)
    .send({ applicant: "Jane", amount: 1000 });
    expect(res.status).toBe(HTTP.CREATED);
    expect(res.body.data.status).toBe("pending");
});

test("GET /loans → 200 for admin", async () => {
    mockAdmin();
    const res = await request(app)
    .get("/api/v1/loans")
    .set("Authorization", adminToken);
    expect(res.status).toBe(HTTP.OK);
    expect(Array.isArray(res.body.data)).toBe(true);
});

test("full flow create→update→review→approve→delete", async () => {
    mockAdmin();

    const create = await request(app)
    .post("/api/v1/loans")
    .set("Authorization", adminToken)
    .send({ applicant: "Aman", amount: 4000 });
    const id = create.body.data.id;

    const update = await request(app)
    .put(`/api/v1/loans/${id}`)
    .set("Authorization", adminToken)
    .send({ amount: 2500 });
    expect(update.status).toBe(HTTP.OK);

    const review = await request(app)
    .put(`/api/v1/loans/${id}/review`)
    .set("Authorization", adminToken);
    expect(review.status).toBe(HTTP.OK);

    const approve = await request(app)
    .put(`/api/v1/loans/${id}/approve`)
    .set("Authorization", adminToken);
    expect(approve.status).toBe(HTTP.OK);

    const del = await request(app)
    .delete(`/api/v1/loans/${id}`)
    .set("Authorization", adminToken);
    expect(del.status).toBe(HTTP.NO_CONTENT);
});

test("POST /loans → 401 missing token", async () => {
    const res = await request(app)
    .post("/api/v1/loans")
    .send({ applicant: "NoAuth", amount: 999 });
    expect(res.status).toBe(HTTP.UNAUTHORIZED);
    expect(res.body.error.code).toBe("TOKEN_NOT_FOUND");
});

test("GET /loans → 401 invalid token", async () => {
    mockInvalid();
    const res = await request(app)
    .get("/api/v1/loans")
    .set("Authorization", "Bearer invalid-token");
    expect(res.status).toBe(HTTP.UNAUTHORIZED);
    expect(res.body.error.code).toBe("UNKNOWN_ERROR");
});

test("POST /loans → 403 when role=user", async () => {
    mockUser();
    const res = await request(app)
    .post("/api/v1/loans")
    .set("Authorization", userToken)
    .send({ applicant: "RoleFail", amount: 500 });
    expect(res.status).toBe(HTTP.FORBIDDEN);
    expect(res.body.error.code).toBe("FORBIDDEN_ACCESS");
});
});
