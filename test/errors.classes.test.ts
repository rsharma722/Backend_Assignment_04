import { HTTP } from "../src/constants/http";
import {
AppError,
RepositoryError,
ServiceError,
AuthenticationError,
AuthorizationError,
} from "../src/api/v1/errors/errors";

describe("Custom Error Classes", () => {
test("RepositoryError works correctly", () => {
    const err = new RepositoryError("Database issue", "FIRESTORE_ERROR");
    expect(err).toBeInstanceOf(AppError);
    expect(err.code).toBe("FIRESTORE_ERROR");
    expect(err.statusCode).toBe(HTTP.INTERNAL_SERVER_ERROR);
});

test("ServiceError works correctly", () => {
    const err = new ServiceError("Validation failed", "VALIDATION_ERROR", HTTP.UNPROCESSABLE_ENTITY);
    expect(err.code).toBe("VALIDATION_ERROR");
    expect(err.statusCode).toBe(HTTP.UNPROCESSABLE_ENTITY);
});

test("AuthenticationError works correctly", () => {
    const err = new AuthenticationError("Missing token", "TOKEN_NOT_FOUND");
    expect(err.message).toBe("Missing token");
    expect(err.code).toBe("TOKEN_NOT_FOUND");
    expect(err.statusCode).toBe(HTTP.UNAUTHORIZED);
});

test("AuthorizationError works correctly", () => {
    const err = new AuthorizationError("Not allowed", "ROLE_NOT_FOUND");
    expect(err.message).toBe("Not allowed");
    expect(err.code).toBe("ROLE_NOT_FOUND");
    expect(err.statusCode).toBe(HTTP.FORBIDDEN);
});
});
