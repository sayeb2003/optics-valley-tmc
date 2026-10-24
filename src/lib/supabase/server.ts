import "server-only";
import { cookies } from "next/headers";
import { createServerClient } from "@supabase/ssr";
import { createClient } from "@supabase/supabase-js";
import { supabaseAnonKey, supabaseServiceKey, supabaseUrl } from "./env";

const noSession = { auth: { persistSession: false, autoRefreshToken: false } } as const;

/** Client acting as the signed-in admin (session stored in cookies). Admin pages + actions only. */
export async function createSessionClient() {
  const cookieStore = await cookies();
  return createServerClient(supabaseUrl, supabaseAnonKey, {
    cookies: {
      getAll() {
        return cookieStore.getAll();
      },
      setAll(cookiesToSet) {
        try {
          cookiesToSet.forEach(({ name, value, options }) =>
            cookieStore.set(name, value, options)
          );
        } catch {
          // Called from a Server Component, where cookies are read-only.
          // Safe to ignore: middleware.ts refreshes the session instead.
        }
      },
    },
  });
}

/** Anonymous, read-only client for the public website (no cookies → cacheable). */
export function createPublicClient() {
  return createClient(supabaseUrl, supabaseAnonKey, noSession);
}

/**
 * Full-access client using the secret key. Bypasses database security rules,
 * so ONLY call it after checking the caller is an owner. Returns null when
 * the secret key isn't configured.
 */
export function createServiceClient() {
  if (!supabaseServiceKey) return null;
  return createClient(supabaseUrl, supabaseServiceKey, noSession);
}
