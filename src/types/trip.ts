import type { Tables, InsertTables, UpdateTables, GenerationStatus, TripFeedback } from "./database";
import type { TravelStyle } from "@/lib/constants/travel-styles";
import type { TripItinerary, CostSummary } from "./itinerary";

export type TripId = string;
export type { GenerationStatus, TripFeedback, TravelStyle };

export type Trip = Tables<"trips">;
export type TripInsert = InsertTables<"trips">;
export type TripUpdate = UpdateTables<"trips">;

export type User = Tables<"users">;
export type UserInsert = InsertTables<"users">;
export type UserUpdate = UpdateTables<"users">;

export type GenerationLog = Tables<"generation_logs">;
export type GenerationLogInsert = InsertTables<"generation_logs">;

export type PlacesCache = Tables<"places_cache">;
export type PlacesCacheInsert = InsertTables<"places_cache">;

/**
 * Lightweight trip projection for list views and summary cards.
 */
export interface TripSummary {
  id: string;
  title: string;
  destination: string;
  days: number;
  travelStyle: TravelStyle;
  budgetUsd: number;
  estimatedTotalUsd: number;
  feedback: TripFeedback | null;
  createdAt: string;
  updatedAt: string;
}

/**
 * Strongly-typed trip domain model with parsed JSONB fields.
 */
export interface TypedTrip extends Omit<Trip, "itinerary" | "cost_summary"> {
  itinerary: TripItinerary;
  costSummary: CostSummary;
}
