import { createClient, type SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/types/database";

let clientInstance: SupabaseClient<Database> | null = null;

function normalizeSupabaseUrl(url: string): string {
  return url.trim().replace(/\/rest\/v1\/?$/, "").replace(/\/+$/, "");
}

export function getSupabaseBrowserClient(): SupabaseClient<Database> {
  if (clientInstance) {
    return clientInstance;
  }

  const rawUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!rawUrl || !supabaseAnonKey) {
    throw new Error(
      "Missing Supabase environment variables: NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are required."
    );
  }

  const supabaseUrl = normalizeSupabaseUrl(rawUrl);

  clientInstance = createClient<Database>(supabaseUrl, supabaseAnonKey);
  return clientInstance;
}
