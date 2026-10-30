import "server-only";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

let client: SupabaseClient | null = null;

export const DESIGNS_BUCKET = "designs";

/**
 * Supabase client with the service-role key. It bypasses row level security,
 * so it must only ever be used in server code (route handlers), never sent to the browser.
 * Returns null when the env vars aren't set.
 */
export function getSupabaseAdmin(): SupabaseClient | null {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return null;
  client ??= createClient(url, key, { auth: { persistSession: false, autoRefreshToken: false } });
  return client;
}
