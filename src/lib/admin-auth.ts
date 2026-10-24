import "server-only";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";

export type AdminRole = "owner" | "editor";

export type AdminContext = {
  userId: string;
  email: string;
  role: AdminRole;
};

/**
 * Who is signed in to the admin portal, or null if nobody (or the signed-in
 * account isn't on the admins list). Uses getUser(), which re-checks the
 * session with Supabase rather than trusting the cookie on its own.
 */
export async function getAdminContext(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;

  const supabase = await createSessionClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data } = await supabase
    .from("admins")
    .select("role, email")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!data) return null;

  return { userId: user.id, email: data.email, role: data.role as AdminRole };
}
