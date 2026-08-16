import { z } from "zod";
import {
  MAX_BUDGET_USD,
  MAX_DAYS,
  MAX_DESTINATION_LENGTH,
} from "@/lib/constants/limits";
import { TRAVEL_STYLES } from "@/lib/constants/travel-styles";

export const tripInputSchema = z.object({
  destination: z
    .string()
    .trim()
    .min(2, "Destination must be at least 2 characters")
    .max(
      MAX_DESTINATION_LENGTH,
      `Destination cannot exceed ${MAX_DESTINATION_LENGTH} characters`
    ),
  budgetUsd: z
    .number()
    .positive("Budget must be greater than $0")
    .max(
      MAX_BUDGET_USD,
      `Budget cannot exceed $${MAX_BUDGET_USD.toLocaleString()}`
    ),
  days: z
    .number()
    .int("Days must be an integer")
    .min(1, "Trip must be at least 1 day")
    .max(MAX_DAYS, `Trip cannot exceed ${MAX_DAYS} days`),
  travelStyle: z.enum(TRAVEL_STYLES),
  interests: z
    .array(z.string().trim().min(1).max(30, "Interest tag too long"))
    .max(5, "Maximum 5 interest tags allowed")
    .optional()
    .default([]),
});

export type TripInputValues = z.infer<typeof tripInputSchema>;
