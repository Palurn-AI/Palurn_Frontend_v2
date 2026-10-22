import axios from "axios";

export class ApiError extends Error {
  readonly status: number;
  readonly details: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.details = details;
  }
}

export function toApiError(error: unknown): ApiError {
  if (error instanceof ApiError) {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const data: unknown = error.response?.data;
    const message =
      typeof data === "object" &&
      data !== null &&
      "message" in data &&
      typeof data.message === "string"
        ? data.message
        : error.message;

    return new ApiError(message, error.response?.status ?? 0, data);
  }

  if (error instanceof Error) {
    return new ApiError(error.message, 0);
  }

  return new ApiError("Request failed", 0);
}

export function getErrorMessage(error: unknown) {
  return error instanceof Error ? error.message : "Request failed";
}
