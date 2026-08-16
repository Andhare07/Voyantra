import { z } from "zod";
import { tripInputSchema } from "./trip-input";
import { costSummarySchema, tripItinerarySchema } from "./itinerary";

export const generateTripRequestSchema = tripInputSchema;

export const createTripRequestSchema = tripInputSchema.extend({
  title: z
    .string()
    .trim()
    .min(1, "Title cannot be empty")
    .max(100, "Title cannot exceed 100 characters")
    .optional(),
  itinerary: tripItinerarySchema,
  costSummary: costSummarySchema,
  promptVersion: z.string().trim().optional().default("itinerary-v1"),
});

export const updateTripRequestSchema = z
  .object({
    title: z
      .string()
      .trim()
      .min(1, "Title cannot be empty")
      .max(100, "Title cannot exceed 100 characters")
      .optional(),
    feedback: z.enum(["positive", "negative"]).nullable().optional(),
  })
  .refine(
    (data) => data.title !== undefined || data.feedback !== undefined,
    {
      message: "At least one field (title or feedback) must be provided for update",
    }
  );

export const tripPaginationSchema = z.object({
  limit: z.coerce
    .number()
    .int("Limit must be an integer")
    .min(1, "Limit must be at least 1")
    .max(50, "Limit cannot exceed 50")
    .optional()
    .default(50),
  offset: z.coerce
    .number()
    .int("Offset must be an integer")
    .min(0, "Offset cannot be negative")
    .optional()
    .default(0),
});

export const uuidParamSchema = z.string().uuid("Invalid trip ID format");
