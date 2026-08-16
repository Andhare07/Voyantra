import { NextResponse } from "next/server";
import { ZodError } from "zod";
import type { ApiErrorCode, ApiErrorDetail, ApiErrorResponse } from "@/types/api";

export class AppError extends Error {
  public readonly statusCode: number;
  public readonly code: ApiErrorCode;
  public readonly details?: ApiErrorDetail[];

  constructor(
    message: string,
    statusCode: number = 500,
    code: ApiErrorCode = "INTERNAL_SERVER_ERROR",
    details?: ApiErrorDetail[]
  ) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }

  static badRequest(message: string, details?: ApiErrorDetail[]): AppError {
    return new AppError(message, 400, "VALIDATION_ERROR", details);
  }

  static unauthorized(message: string = "Authentication required"): AppError {
    return new AppError(message, 401, "UNAUTHORIZED");
  }

  static forbidden(message: string = "Forbidden"): AppError {
    return new AppError(message, 403, "FORBIDDEN");
  }

  static notFound(message: string = "Resource not found"): AppError {
    return new AppError(message, 404, "NOT_FOUND");
  }

  static rateLimitExceeded(
    message: string = "Daily generation limit reached",
    details?: ApiErrorDetail[]
  ): AppError {
    return new AppError(message, 429, "RATE_LIMIT_EXCEEDED", details);
  }

  static generationFailed(message: string = "AI itinerary generation failed"): AppError {
    return new AppError(message, 502, "GENERATION_FAILED");
  }

  static databaseError(message: string = "Database operation failed"): AppError {
    return new AppError(message, 500, "DATABASE_ERROR");
  }

  static notImplemented(message: string = "Feature not yet implemented"): AppError {
    return new AppError(message, 501, "NOT_IMPLEMENTED");
  }

  static internal(message: string = "An unexpected error occurred"): AppError {
    return new AppError(message, 500, "INTERNAL_SERVER_ERROR");
  }
}

export function formatZodError(error: ZodError): ApiErrorResponse {
  const details: ApiErrorDetail[] = error.issues.map((issue) => ({
    field: issue.path.join("."),
    message: issue.message,
  }));

  return {
    error: {
      code: "VALIDATION_ERROR",
      message: "The request payload failed validation.",
      details,
    },
  };
}

export function handleApiError(error: unknown): NextResponse<ApiErrorResponse> {
  if (error instanceof ZodError) {
    return NextResponse.json(formatZodError(error), { status: 400 });
  }

  if (error instanceof AppError) {
    return NextResponse.json(
      {
        error: {
          code: error.code,
          message: error.message,
          ...(error.details && error.details.length > 0
            ? { details: error.details }
            : {}),
        },
      },
      { status: error.statusCode }
    );
  }

  // Check for Clerk UNAUTHORIZED message if thrown
  if (error instanceof Error && error.message === "UNAUTHORIZED") {
    return NextResponse.json(
      {
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required",
        },
      },
      { status: 401 }
    );
  }

  const message =
    process.env.NODE_ENV === "production"
      ? "An unexpected error occurred."
      : error instanceof Error
        ? error.message
        : "An unexpected error occurred.";

  return NextResponse.json(
    {
      error: {
        code: "INTERNAL_SERVER_ERROR",
        message,
      },
    },
    { status: 500 }
  );
}
