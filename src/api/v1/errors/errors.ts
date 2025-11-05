import { HTTP } from "../../../constants/http";

export class AppError extends Error {
constructor(
    public message: string,
    public code: string,
    public statusCode: number
) {
    super(message);
    this.name = new.target.name;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace?.(this, this.constructor);
}
}

export class RepositoryError extends AppError {
constructor(
    message: string,
    code: string,
    statusCode: number = HTTP.INTERNAL_SERVER_ERROR
) {
    super(message, code, statusCode);
}
}

export class ServiceError extends AppError {
constructor(
    message: string,
    code: string = "SERVICE_ERROR",
    statusCode: number = HTTP.INTERNAL_SERVER_ERROR
) {
    super(message, code, statusCode);
}
}

export class AuthenticationError extends AppError {
constructor(
    message: string,
    code: string = "AUTHENTICATION_ERROR",
    statusCode: number = HTTP.UNAUTHORIZED
) {
    super(message, code, statusCode);
}
}

export class AuthorizationError extends AppError {
constructor(
    message: string,
    code: string = "AUTHORIZATION_ERROR",
    statusCode: number = HTTP.FORBIDDEN
) {
    super(message, code, statusCode);
}
}