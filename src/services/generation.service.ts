import { AppError } from "@/lib/utils/errors";
import { rateLimitService } from "./rate-limit.service";
import type { GenerateTripRequest, GenerateTripResponse } from "@/types/api";

export class GenerationService {
  /**
   * Orchestrates the itinerary generation pipeline.
   * Validates rate limits, logs audit records, and will invoke Gemini in the AI phase.
   */
  async generateItinerary(
    userId: string,
    _request: GenerateTripRequest
  ): Promise<GenerateTripResponse> {
    void _request;

    if (!userId) {
      throw AppError.unauthorized();
    }

    // 1. Enforce 24-hour rolling rate limit (3 generations per day)
    const quota = await rateLimitService.checkGenerationQuota(userId);
    if (!quota.allowed) {
      throw AppError.rateLimitExceeded(
        `Daily generation limit reached (${quota.limit} per day). Your quota resets at ${new Date(
          quota.resetsAt
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`
      );
    }

    // 2. Temporary placeholder response: Gemini AI pipeline will be integrated in the AI phase.
    // Do not call Gemini or create fake/mock itinerary data per instructions.
    throw AppError.notImplemented(
      "AI itinerary generation is ready for the Gemini integration phase. The rate limit check passed."
    );
  }
}

export const generationService = new GenerationService();
