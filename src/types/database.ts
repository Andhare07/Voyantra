import type { TravelStyle } from "@/lib/constants/travel-styles";

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type GenerationStatus = "saved" | "draft" | "generating" | "failed";
export type TripFeedback = "positive" | "negative";

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [];
      };
      trips: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          destination: string;
          budget_usd: number;
          days: number;
          travel_style: TravelStyle;
          interests: string[];
          itinerary: Json;
          cost_summary: Json;
          generation_status: GenerationStatus;
          prompt_version: string;
          feedback: TripFeedback | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          title: string;
          destination: string;
          budget_usd: number;
          days: number;
          travel_style: TravelStyle;
          interests?: string[];
          itinerary?: Json;
          cost_summary?: Json;
          generation_status?: GenerationStatus;
          prompt_version?: string;
          feedback?: TripFeedback | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          destination?: string;
          budget_usd?: number;
          days?: number;
          travel_style?: TravelStyle;
          interests?: string[];
          itinerary?: Json;
          cost_summary?: Json;
          generation_status?: GenerationStatus;
          prompt_version?: string;
          feedback?: TripFeedback | null;
          created_at?: string;
          updated_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "trips_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      generation_logs: {
        Row: {
          id: string;
          user_id: string;
          success: boolean;
          duration_ms: number;
          prompt_version: string;
          error_code: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          success: boolean;
          duration_ms: number;
          prompt_version?: string;
          error_code?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          success?: boolean;
          duration_ms?: number;
          prompt_version?: string;
          error_code?: string | null;
          created_at?: string;
        };
        Relationships: [
          {
            foreignKeyName: "generation_logs_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "users";
            referencedColumns: ["id"];
          },
        ];
      };
      places_cache: {
        Row: {
          place_id: string;
          name: string;
          formatted_address: string;
          lat: number;
          lng: number;
          types: string[];
          cached_at: string;
          expires_at: string;
        };
        Insert: {
          place_id: string;
          name: string;
          formatted_address: string;
          lat: number;
          lng: number;
          types?: string[];
          cached_at?: string;
          expires_at: string;
        };
        Update: {
          place_id?: string;
          name?: string;
          formatted_address?: string;
          lat?: number;
          lng?: number;
          types?: string[];
          cached_at?: string;
          expires_at?: string;
        };
        Relationships: [];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      [_ in never]: never;
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
}

export type Tables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Row"];
export type InsertTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Insert"];
export type UpdateTables<T extends keyof Database["public"]["Tables"]> =
  Database["public"]["Tables"][T]["Update"];
