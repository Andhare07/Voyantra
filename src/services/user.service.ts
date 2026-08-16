import { getSupabaseAdminClient } from "@/lib/supabase/admin";
import { AppError } from "@/lib/utils/errors";
import type { User } from "@/types/trip";

export class UserService {
  /**
   * Ensures a user row exists in the Supabase users mirror table.
   * Upserts the row on conflict on id to guarantee relational integrity.
   */
  async ensureUser(userId: string, email?: string | null): Promise<User> {
    if (!userId) {
      throw AppError.unauthorized("User ID is required");
    }

    const supabase = getSupabaseAdminClient();

    const { data, error } = await supabase
      .from("users")
      .upsert(
        {
          id: userId,
          email: email ?? null,
        },
        {
          onConflict: "id",
          ignoreDuplicates: true,
        }
      )
      .select()
      .maybeSingle();

    if (error) {
      console.error("[UserService] Failed to ensure user:", error);
      throw AppError.databaseError("Failed to sync user account.");
    }

    if (data) {
      return data;
    }

    // If ignored duplicate didn't return a row, fetch it
    const { data: existingUser, error: fetchError } = await supabase
      .from("users")
      .select()
      .eq("id", userId)
      .single();

    if (fetchError || !existingUser) {
      console.error("[UserService] Failed to fetch existing user:", fetchError);
      throw AppError.databaseError("Failed to retrieve user account.");
    }

    return existingUser;
  }
}

export const userService = new UserService();
