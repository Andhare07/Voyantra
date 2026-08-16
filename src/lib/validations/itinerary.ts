import { z } from "zod";

export const activitySchema = z.object({
  name: z.string().trim().min(1, "Activity name is required"),
  description: z.string().trim().min(1, "Activity description is required"),
  estimatedCostUSD: z.number().min(0, "Cost cannot be negative"),
  location: z.string().trim().optional(),
  durationHours: z.number().positive().optional(),
});

export const restaurantSchema = z.object({
  name: z.string().trim().min(1, "Restaurant name is required"),
  description: z.string().trim().min(1, "Restaurant description is required"),
  estimatedCostUSD: z.number().min(0, "Cost cannot be negative"),
  cuisine: z.string().trim().optional(),
  address: z.string().trim().optional(),
});

export const daySlotSchema = z.object({
  period: z.enum(["morning", "afternoon", "evening"]),
  activity: activitySchema,
});

export const mealSlotSchema = z.object({
  type: z.enum(["breakfast", "lunch", "dinner"]),
  restaurant: restaurantSchema,
});

export const dayPlanSchema = z.object({
  dayNumber: z.number().int().min(1),
  theme: z.string().trim().optional(),
  slots: z.array(daySlotSchema).min(1, "Each day must have at least one activity"),
  meals: z.array(mealSlotSchema).min(1, "Each day must have at least one meal"),
});

export const hotelSchema = z.object({
  name: z.string().trim().min(1, "Hotel name is required"),
  description: z.string().trim().min(1, "Hotel description is required"),
  estimatedCostUSD: z.number().min(0, "Cost cannot be negative"),
  rating: z.number().min(1).max(5).optional(),
  priceTier: z.enum(["budget", "moderate", "luxury"]).optional(),
  address: z.string().trim().optional(),
});

export const costSummarySchema = z.object({
  lodging: z.number().min(0, "Lodging cost cannot be negative"),
  food: z.number().min(0, "Food cost cannot be negative"),
  activities: z.number().min(0, "Activities cost cannot be negative"),
  transport: z.number().min(0, "Transport cost cannot be negative"),
  misc: z.number().min(0, "Misc cost cannot be negative"),
  total: z.number().min(0, "Total cost cannot be negative"),
});

export const tripItinerarySchema = z.object({
  destination: z.string().trim().min(1, "Destination is required"),
  days: z.array(dayPlanSchema).min(1, "Itinerary must contain at least 1 day"),
  hotels: z.array(hotelSchema).min(1, "Itinerary must contain at least 1 hotel recommendation"),
});

export type ActivitySchemaType = z.infer<typeof activitySchema>;
export type RestaurantSchemaType = z.infer<typeof restaurantSchema>;
export type DayPlanSchemaType = z.infer<typeof dayPlanSchema>;
export type HotelSchemaType = z.infer<typeof hotelSchema>;
export type CostSummarySchemaType = z.infer<typeof costSummarySchema>;
export type TripItinerarySchemaType = z.infer<typeof tripItinerarySchema>;
