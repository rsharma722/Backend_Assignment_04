export const getErrorMessage = (error: unknown): string => {
if (error instanceof Error) return error.message;
return String(error);
};

export const getErrorCode = (error: unknown): string => {
if (error && typeof error === "object" && "code" in (error as any)) {
    const c = (error as any).code;
    if (typeof c === "string" && c.trim().length) return c;
}
return "UNKNOWN_ERROR";
};