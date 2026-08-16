import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { MAX_GENERATIONS_PER_DAY } from "@/lib/constants/limits";
import { AppError } from "@/lib/utils/errors";
import type { TripQuotaResponse } from "@/types/api";

export class RateLimitService {
  /**
   * Checks the user's 24-hour generation quota against generation_logs.
   */
  async checkGenerationQuota(userId: string): Promise<{
    allowed: boolean;
    used: number;
    limit: number;
    remaining: number;
    resetsAt: string;
  }> {
    if (!userId) {
      throw AppError.unauthorized();
    }

    const supabase = getSupabaseAdminClient();
    const twentyFourHoursAgo = new Date(
      Date.now() - 24 * 60 * 60 * 1000
    ).toISOString();

    // Fetch successful generations in the past 24 hours
    const { data: logs, error } = await supabase
      .from("generation_logs")
      .select("created_at")
      .eq("user_id", userId)
      .eq("success", true)
      .gte("created_at", twentyFourHoursAgo)
      .order("created_at", { ascending: true });

    if (error) {
      console.error("[RateLimitService] Failed to check generation quota:", error);
      throw AppError.databaseError("Failed to check generation limit.");
    }

    const used = logs?.length ?? 0;
    const limit = MAX_GENERATIONS_PER_DAY;
    const remaining = Math.max(0, limit - used);
    const allowed = used < limit;

    // Reset time is 24 hours after the oldest recorded generation in the rolling window
    let resetsAtDate: Date;
    if (logs && logs.length > 0) {
      const oldestLogTime = new Date(logs[0].created_at).getTime();
      resetsAtDate = new Date(oldestLogTime + 24 * 60 * 60 * 1000);
    } else {
      resetsAtDate = new Date(Date.now() + 24 * 60 * 60 * 1000);
    }

    return {
      allowed,
      used,
      limit,
      remaining,
      resetsAt: resetsAtDate.toISOString(),
    };
  }

  /**
   * Logs an AI generation attempt for rate-limiting, observability, and audit tracking.
   */
  async logGeneration(params: {
    userId: string;
    success: boolean;
    durationMs: number;
    promptVersion?: string;
    errorCode?: string | null;
  }): Promise<void> {
    const supabase = getSupabaseAdminClient();

    const { error } = await supabase.from("generation_logs").insert({
      user_id: params.userId,
      success: params.success,
      duration_ms: Math.max(0, params.durationMs),
      prompt_version: params.promptVersion ?? "v1",
      error_code: params.errorCode ?? null,
    });

    if (error) {
      console.error("[RateLimitService] Failed to write generation log:", error);
      // Non-fatal if logging fails during recovery, but logged to server console
    }
  }

  /**
   * Returns current quota status for GET /api/trips/quota.
   */
  async getQuotaStatus(userId: string): Promise<TripQuotaResponse> {
    const quota = await this.checkGenerationQuota(userId);
    return {
      limit: quota.limit,
      used: quota.used,
      remaining: quota.remaining,
      resetsAt: quota.resetsAt,
    };
  }
}

export const rateLimitService = new RateLimitService();
