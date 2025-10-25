import request from "supertest";
import app from "../src/app";
import { HTTP } from "../src/constants/http";

jest.mock("../src/config/firebaseConfig", () => ({
auth: {
    setCustomUserClaims: jest.fn(),
    getUser: jest.fn(),
    verifyIdToken: jest.fn(),
},
}));

import { auth } from "../src/config/firebaseConfig";

jest.mock("fs", () => ({
existsSync: jest.fn(() => true),
mkdirSync: jest.fn(),
createWriteStream: jest.fn(() => ({ write: jest.fn() })),
appendFileSync: jest.fn(),
}));

describe("Custom Claims Tests", () => {
const UID = "test-user-123";

beforeEach(() => {
    jest.clearAllMocks();
    process.env.NODE_ENV = "test";
    (auth.verifyIdToken as jest.Mock).mockResolvedValue({ uid: "admin-1", role: "admin" });
});

test("should set custom claims successfully", async () => {
    (auth.setCustomUserClaims as jest.Mock).mockResolvedValueOnce(undefined);

    const res = await request(app)
    .post("/api/v1/admin/setCustomClaims")
    .set("Authorization", "Bearer test-token")  
    .send({ uid: UID, claims: { role: "admin" } });

    expect(res.status).toBe(HTTP.OK);
    expect(auth.setCustomUserClaims).toHaveBeenCalledWith(UID, { role: "admin" });
    expect(res.body).toMatchObject({
    message: `Custom claims set for user: ${UID}`,
    claims: { role: "admin" },
    });
});

test("should get user info successfully", async () => {
    (auth.getUser as jest.Mock).mockResolvedValueOnce({
    uid: UID,
    email: "admin@test.com",
    customClaims: { role: "admin" },
    });

    const res = await request(app)
    .get(`/api/v1/users/${UID}`)
    .set("Authorization", "Bearer valid-admin-token");

    expect(res.status).toBe(HTTP.OK);
    expect(auth.getUser).toHaveBeenCalledWith(UID);
    expect(res.body.data.uid).toBe(UID);
    expect(res.body.data.customClaims.role).toBe("admin");
});

test("should handle error when setting custom claims", async () => {
    (auth.setCustomUserClaims as jest.Mock).mockRejectedValueOnce(new Error("failed"));

    const res = await request(app)
    .post("/api/v1/admin/setCustomClaims")
    .set("Authorization", "Bearer test-token")  
    .send({ uid: UID, claims: { role: "manager" } });

    expect(res.status).toBe(HTTP.INTERNAL_SERVER_ERROR);
    expect(res.body.success).toBe(false);
    expect(res.body.error.code).toBe("UNKNOWN_ERROR");
});
});
