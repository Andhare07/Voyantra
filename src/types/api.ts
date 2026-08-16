import type { TravelStyle, Trip, TripFeedback, TripSummary } from "./trip";
import type { CostSummary, GenerationMeta, TripItinerary } from "./itinerary";

export type ApiErrorCode =
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "VALIDATION_ERROR"
  | "RATE_LIMIT_EXCEEDED"
  | "GENERATION_FAILED"
  | "PLACES_UNAVAILABLE"
  | "DATABASE_ERROR"
  | "INTERNAL_SERVER_ERROR"
  | "NOT_IMPLEMENTED";

export interface ApiErrorDetail {
  field?: string;
  message: string;
}

export interface ApiErrorResponse {
  error: {
    code: ApiErrorCode;
    message: string;
    details?: ApiErrorDetail[];
  };
}

export interface GenerateTripRequest {
  destination: string;
  budgetUsd: number;
  days: number;
  travelStyle: TravelStyle;
  interests?: string[];
}

export interface GenerateTripResponse {
  itinerary: TripItinerary;
  costSummary: CostSummary;
  meta: GenerationMeta;
}

export interface CreateTripRequest {
  destination: string;
  budgetUsd: number;
  days: number;
  travelStyle: TravelStyle;
  interests?: string[];
  title?: string;
  itinerary: TripItinerary;
  costSummary: CostSummary;
  promptVersion?: string;
}

export interface CreateTripResponse {
  trip: Trip;
}

export interface TripListResponse {
  trips: TripSummary[];
  total: number;
}

export interface TripDetailResponse {
  trip: Trip;
}

export interface UpdateTripRequest {
  title?: string;
  feedback?: TripFeedback | null;
}

export interface UpdateTripResponse {
  trip: {
    id: string;
    title: string;
    feedback: TripFeedback | null;
    updatedAt: string;
  };
}

export interface TripQuotaResponse {
  limit: number;
  used: number;
  remaining: number;
  resetsAt: string;
}
