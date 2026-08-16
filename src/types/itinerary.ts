export type ItineraryDayNumber = number;

export type MealType = "breakfast" | "lunch" | "dinner";
export type DayPeriod = "morning" | "afternoon" | "evening";
export type PriceTier = "budget" | "moderate" | "luxury";

export interface Activity {
  name: string;
  description: string;
  estimatedCostUSD: number;
  location?: string;
  durationHours?: number;
}

export interface Restaurant {
  name: string;
  description: string;
  estimatedCostUSD: number;
  cuisine?: string;
  address?: string;
}

export interface DaySlot {
  period: DayPeriod;
  activity: Activity;
}

export interface MealSlot {
  type: MealType;
  restaurant: Restaurant;
}

export interface DayPlan {
  dayNumber: number;
  theme?: string;
  slots: DaySlot[];
  meals: MealSlot[];
}

export interface Hotel {
  name: string;
  description: string;
  estimatedCostUSD: number;
  rating?: number;
  priceTier?: PriceTier;
  address?: string;
}

export interface CostSummary {
  lodging: number;
  food: number;
  activities: number;
  transport: number;
  misc: number;
  total: number;
}

export interface GenerationMeta {
  promptVersion: string;
  budgetDelta: number;
  overBudget: boolean;
  warnings: string[];
  placesEnriched: boolean;
  generationDurationMs?: number;
}

export interface TripItinerary {
  destination: string;
  days: DayPlan[];
  hotels: Hotel[];
}
