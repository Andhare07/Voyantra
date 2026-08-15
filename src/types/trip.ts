import type { Tables, InsertTables, UpdateTables, GenerationStatus, TripFeedback } from "./database";
import type { TravelStyle } from "@/lib/constants/travel-styles";

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
