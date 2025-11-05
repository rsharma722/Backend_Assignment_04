export const errorResponse = (message: string, code: string) => ({
    success: false,
    error: { message, code },
    timestamp: new Date().toISOString(),
});
