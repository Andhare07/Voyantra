import {
  costSummarySchema,
  tripItinerarySchema,
} from "@/lib/validations/itinerary";
import type { CostSummary, TripItinerary } from "@/types/itinerary";

export function extractJsonString(raw: string): string {
  let cleaned = raw.trim();

  // Strip markdown code fences if present (e.g. ```json ... ``` or ``` ...)
  if (cleaned.startsWith("```")) {
    cleaned = cleaned.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/, "");
  }

  // Find boundaries of outer JSON object
  const start = cleaned.indexOf("{");
  const end = cleaned.lastIndexOf("}");

  if (start !== -1 && end !== -1 && end > start) {
    return cleaned.slice(start, end + 1);
  }

  return cleaned;
}

export function parseAndValidateItinerary(
  rawText: string,
  expectedDays: number
): {
  itinerary: TripItinerary;
  costSummary: CostSummary;
} {
  const jsonString = extractJsonString(rawText);

  let parsed: unknown;
  try {
    parsed = JSON.parse(jsonString);
  } catch (err) {
    throw new Error(
      `JSON_PARSE_ERROR: ${err instanceof Error ? err.message : "Invalid JSON syntax"}`
    );
  }

  if (typeof parsed !== "object" || parsed === null) {
    throw new Error("SCHEMA_VALIDATION_ERROR: Output must be a JSON object");
  }

  const record = parsed as Record<string, unknown>;

  // Validate itinerary schema
  const itineraryValidation = tripItinerarySchema.safeParse(record);
  if (!itineraryValidation.success) {
    const issueMessages = itineraryValidation.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`SCHEMA_VALIDATION_ERROR: ${issueMessages}`);
  }

  // Validate cost summary schema
  const costValidation = costSummarySchema.safeParse(record.costSummary);
  if (!costValidation.success) {
    const issueMessages = costValidation.error.issues
      .map((i) => `${i.path.join(".")}: ${i.message}`)
      .join("; ");
    throw new Error(`COST_SUMMARY_VALIDATION_ERROR: ${issueMessages}`);
  }

  const itinerary = itineraryValidation.data as TripItinerary;
  const costSummary = costValidation.data as CostSummary;

  // Verify day count matches user input
  if (itinerary.days.length !== expectedDays) {
    throw new Error(
      `DAY_COUNT_MISMATCH: Expected ${expectedDays} days, but received ${itinerary.days.length} days.`
    );
  }

  return {
    itinerary,
    costSummary,
  };
}
