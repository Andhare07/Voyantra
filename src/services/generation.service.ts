import { geminiClient } from "@/ai/gemini.client";
import { parseAndValidateItinerary } from "@/ai/parser";
import { postProcessItinerary } from "@/ai/post-process";
import { buildItineraryPrompt } from "@/ai/prompts/itinerary-v1";
import { AppError } from "@/lib/utils/errors";
import { rateLimitService } from "./rate-limit.service";
import type { GenerateTripRequest, GenerateTripResponse } from "@/types/api";

export class GenerationService {
  /**
   * Orchestrates the complete Gemini AI itinerary generation pipeline:
   * 1. Enforces 3/day rolling rate limit.
   * 2. Prompts Gemini with structured JSON output constraints.
   * 3. Parses and validates output against Zod schemas (with 1 automated repair retry).
   * 4. Enforces cost math consistency (lodging + food + activities + transport + misc = total).
   * 5. Logs audit metrics to generation_logs.
   */
  async generateItinerary(
    userId: string,
    request: GenerateTripRequest
  ): Promise<GenerateTripResponse> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    // 1. Rate limit check (3 generations per 24-hour rolling window)
    const quota = await rateLimitService.checkGenerationQuota(userId);
    if (!quota.allowed) {
      throw AppError.rateLimitExceeded(
        `Daily generation limit reached (${quota.limit} per day). Your quota resets at ${new Date(
          quota.resetsAt
        ).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}.`
      );
    }

    const startTime = Date.now();
    const { prompt, systemInstruction, promptVersion } = buildItineraryPrompt(request);

    let rawOutput: string | null = null;

    try {
      // 2. Primary Gemini model invocation
      rawOutput = await geminiClient.generateItineraryContent(
        prompt,
        systemInstruction
      );

      let parsedData;
      try {
        parsedData = parseAndValidateItinerary(rawOutput, request.days);
      } catch (parseError) {
        console.warn(
          "[GenerationService] Initial JSON validation failed. Attempting automated repair prompt...",
          parseError instanceof Error ? parseError.message : ""
        );

        // 3. Automated JSON repair attempt (max 1 retry)
        const repairedOutput = await geminiClient.repairJsonContent(
          rawOutput,
          parseError instanceof Error ? parseError.message : "Schema validation error"
        );

        parsedData = parseAndValidateItinerary(repairedOutput, request.days);
      }

      const durationMs = Date.now() - startTime;

      // 4. Post-processing & strict mathematical normalization
      const response = postProcessItinerary({
        itinerary: parsedData.itinerary,
        costSummary: parsedData.costSummary,
        budgetUsd: request.budgetUsd,
        promptVersion,
        durationMs,
      });

      // 5. Log successful generation attempt
      await rateLimitService.logGeneration({
        userId,
        success: true,
        durationMs,
        promptVersion,
      });

      return response;
    } catch (error) {
      const durationMs = Date.now() - startTime;
      const errorCode =
        error instanceof AppError
          ? error.code
          : error instanceof Error && error.message.includes("PARSE")
            ? "PARSE_FAILED"
            : "GENERATION_FAILED";

      // Log failed generation attempt for observability
      await rateLimitService.logGeneration({
        userId,
        success: false,
        durationMs,
        promptVersion,
        errorCode,
      });

      if (error instanceof AppError) {
        throw error;
      }

      console.error(
        "[GenerationService] Generation failed:",
        error instanceof Error ? error.message : "Unknown error"
      );

      throw AppError.generationFailed(
        "Failed to generate travel itinerary. Please try again."
      );
    }
  }
}

export const generationService = new GenerationService();
