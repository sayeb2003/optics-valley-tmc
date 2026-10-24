/**
 * Supabase settings, read from environment variables (set in Vercel →
 * Project → Settings → Environment Variables, and in .env.local for local dev).
 *
 * None of these are NEXT_PUBLIC_ — the browser never talks to Supabase
 * directly. Every request goes browser → our Vercel server → Supabase, which
 * keeps keys private and works the same from mainland China.
 */
export const supabaseUrl = process.env.SUPABASE_URL ?? "";
/** The "publishable" key (or legacy "anon" key). Safe-ish, but still kept server-side. */
export const supabaseAnonKey = process.env.SUPABASE_ANON_KEY ?? "";
/** The "secret" key (or legacy "service_role" key). NEVER expose this anywhere. */
export const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? "";

export function isSupabaseConfigured(): boolean {
  return Boolean(supabaseUrl && supabaseAnonKey);
}
