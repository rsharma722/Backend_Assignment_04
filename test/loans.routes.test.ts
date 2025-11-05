import request from "supertest";
import app from "../src/app";
import { HTTP } from "../src/constants/http";

describe.skip("Step 2: basic loan endpoints (no auth yet)", () => {
let id = "";

it("GET /api/v1/health → 200", async () => {
    const res = await request(app).get("/api/v1/health");
    expect(res.status).toBe(HTTP.OK);
    expect(res.body).toEqual({ ok: true });
});

it("POST /api/v1/loans → 201 creates a loan", async () => {
    const res = await request(app)
    .post("/api/v1/loans")
    .send({ applicant: "John Doe", amount: 5000 });

    expect(res.status).toBe(HTTP.CREATED);
    expect(res.body?.data).toMatchObject({
    applicant: "John Doe",
    amount: 5000,
    status: "pending",
    });

    expect(typeof res.body?.data?.id).toBe("string");
    id = res.body.data.id;
});

it("GET /api/v1/loans → 200 lists loans (includes created)", async () => {
    const res = await request(app).get("/api/v1/loans");
    expect(res.status).toBe(HTTP.OK);
    expect(Array.isArray(res.body?.data)).toBe(true);

    const found = res.body.data.find((l: any) => l.id === id);
    expect(found).toBeTruthy();
});

it("GET /api/v1/loans/:id → 200 returns that loan", async () => {
    const res = await request(app).get(`/api/v1/loans/${id}`);
    expect(res.status).toBe(HTTP.OK);
    expect(res.body?.data?.id).toBe(id);
});

it("PUT /api/v1/loans/:id → 200 updates amount", async () => {
    const res = await request(app)
    .put(`/api/v1/loans/${id}`)
    .send({ amount: 7500 });

    expect(res.status).toBe(HTTP.OK);
    expect(res.body?.data?.amount).toBe(7500);
});

it("PUT /api/v1/loans/:id/review → 200 sets under_review", async () => {
    const res = await request(app).put(`/api/v1/loans/${id}/review`);
    expect(res.status).toBe(HTTP.OK);
    expect(res.body?.data?.status).toBe("under_review");
});

it("PUT /api/v1/loans/:id/approve → 200 sets approved", async () => {
    const res = await request(app).put(`/api/v1/loans/${id}/approve`);
    expect(res.status).toBe(HTTP.OK);
    expect(res.body?.data?.status).toBe("approved");
});

it("DELETE /api/v1/loans/:id → 204 removes the loan", async () => {
    const res = await request(app).delete(`/api/v1/loans/${id}`);
    expect(res.status).toBe(HTTP.NO_CONTENT);
    expect(res.text).toBe("");
});

it("GET /api/v1/loans/:id (deleted) → 404", async () => {
    const res = await request(app).get(`/api/v1/loans/${id}`);
    expect(res.status).toBe(HTTP.NOT_FOUND);
});
});
