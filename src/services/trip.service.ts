import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AppError } from "@/lib/utils/errors";
import { userService } from "./user.service";
import type {
  Trip,
  TripFeedback,
  TripInsert,
  TripSummary,
} from "@/types/trip";
import type { Json } from "@/types/database";
import type { CreateTripRequest, UpdateTripRequest } from "@/types/api";

export class TripService {
  /**
   * Retrieves all saved trips for the authenticated user, newest first.
   */
  async getUserTrips(
    userId: string,
    options: { limit?: number; offset?: number } = {}
  ): Promise<{ trips: TripSummary[]; total: number }> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    const limit = options.limit ?? 50;
    const offset = options.offset ?? 0;
    const supabase = getSupabaseAdminClient();

    // Query trips scoped strictly by user_id
    const {
      data,
      count,
      error,
    } = await supabase
      .from("trips")
      .select(
        "id, title, destination, days, travel_style, budget_usd, cost_summary, feedback, created_at, updated_at",
        { count: "exact" }
      )
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      console.error("[TripService] Failed to fetch user trips:", error);
      throw AppError.databaseError("Failed to fetch trips.");
    }

    const trips: TripSummary[] = (data ?? []).map((row) => {
      const costSummary = row.cost_summary as Record<string, unknown> | null;
      const totalCost = typeof costSummary?.total === "number" ? costSummary.total : 0;

      return {
        id: row.id,
        title: row.title,
        destination: row.destination,
        days: row.days,
        travelStyle: row.travel_style,
        budgetUsd: Number(row.budget_usd),
        estimatedTotalUsd: totalCost,
        feedback: row.feedback as TripFeedback | null,
        createdAt: row.created_at,
        updatedAt: row.updated_at,
      };
    });

    return {
      trips,
      total: count ?? trips.length,
    };
  }

  /**
   * Retrieves a single saved trip by ID, strictly enforcing user ownership.
   */
  async getTripById(userId: string, tripId: string): Promise<Trip> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("trips")
      .select("*")
      .eq("id", tripId)
      .eq("user_id", userId)
      .maybeSingle();

    if (error) {
      console.error("[TripService] Failed to fetch trip by ID:", error);
      throw AppError.databaseError("Failed to fetch trip details.");
    }

    if (!data) {
      // Return 404 to avoid leaking whether another user's trip exists
      throw AppError.notFound("Trip not found.");
    }

    return data;
  }

  /**
   * Persists a generated itinerary to the database, ensuring the user record exists.
   */
  async createTrip(userId: string, request: CreateTripRequest): Promise<Trip> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    // Ensure user record exists in Supabase users table
    await userService.ensureUser(userId);

    const supabase = getSupabaseAdminClient();
    const autoTitle = `${request.destination} — ${request.days} ${request.days === 1 ? "day" : "days"}`;
    const finalTitle = request.title && request.title.trim().length > 0 ? request.title.trim() : autoTitle;

    const newTripPayload: TripInsert = {
      user_id: userId,
      title: finalTitle,
      destination: request.destination.trim(),
      budget_usd: request.budgetUsd,
      days: request.days,
      travel_style: request.travelStyle,
      interests: request.interests ?? [],
      itinerary: request.itinerary as unknown as Json,
      cost_summary: request.costSummary as unknown as Json,
      generation_status: "saved",
      prompt_version: request.promptVersion ?? "itinerary-v1",
      feedback: null,
    };

    const { data, error } = await supabase
      .from("trips")
      .insert(newTripPayload)
      .select()
      .single();

    if (error || !data) {
      console.error("[TripService] Failed to create trip:", error);
      throw AppError.databaseError("Failed to save trip.");
    }

    return data;
  }

  /**
   * Deletes a saved trip by ID, strictly enforcing user ownership.
   */
  async deleteTrip(userId: string, tripId: string): Promise<void> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    const supabase = getSupabaseAdminClient();

    // First check existence & ownership
    const { data: existing, error: checkError } = await supabase
      .from("trips")
      .select("id")
      .eq("id", tripId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("[TripService] Error checking trip before delete:", checkError);
      throw AppError.databaseError("Failed to delete trip.");
    }

    if (!existing) {
      throw AppError.notFound("Trip not found.");
    }

    const { error: deleteError } = await supabase
      .from("trips")
      .delete()
      .eq("id", tripId)
      .eq("user_id", userId);

    if (deleteError) {
      console.error("[TripService] Failed to delete trip:", deleteError);
      throw AppError.databaseError("Failed to delete trip.");
    }
  }

  /**
   * Updates mutable trip fields (title or feedback rating), strictly enforcing user ownership.
   */
  async updateTrip(
    userId: string,
    tripId: string,
    updates: UpdateTripRequest
  ): Promise<{
    id: string;
    title: string;
    feedback: TripFeedback | null;
    updatedAt: string;
  }> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    const supabase = getSupabaseAdminClient();

    // Ensure trip exists and is owned by user
    const { data: existing, error: checkError } = await supabase
      .from("trips")
      .select("id, title, feedback")
      .eq("id", tripId)
      .eq("user_id", userId)
      .maybeSingle();

    if (checkError) {
      console.error("[TripService] Error verifying trip before update:", checkError);
      throw AppError.databaseError("Failed to update trip.");
    }

    if (!existing) {
      throw AppError.notFound("Trip not found.");
    }

    const updatePayload: { title?: string; feedback?: TripFeedback | null } = {};
    if (updates.title !== undefined) {
      updatePayload.title = updates.title.trim();
    }
    if (updates.feedback !== undefined) {
      updatePayload.feedback = updates.feedback;
    }

    const { data, error } = await supabase
      .from("trips")
      .update(updatePayload)
      .eq("id", tripId)
      .eq("user_id", userId)
      .select("id, title, feedback, updated_at")
      .single();

    if (error || !data) {
      console.error("[TripService] Failed to update trip:", error);
      throw AppError.databaseError("Failed to update trip.");
    }

    return {
      id: data.id,
      title: data.title,
      feedback: data.feedback as TripFeedback | null,
      updatedAt: data.updated_at,
    };
  }
}

export const tripService = new TripService();
