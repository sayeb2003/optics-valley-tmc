import "server-only";
import { executiveTeam, pastLeaders, type ExecRole, type PastLeader } from "@/config/club";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createPublicClient } from "@/lib/supabase/server";

export type LeaderSection = "current" | "past";

export type LeaderRow = {
  id: string;
  section: LeaderSection;
  name: string;
  role: string;
  note: string | null;
  sort_order: number;
};

export type PublicLeaders = { current: ExecRole[]; past: PastLeader[] };

const fallback: PublicLeaders = { current: executiveTeam, past: pastLeaders };

/**
 * Leadership list for the public homepage.
 * Reads from Supabase when it's configured; otherwise (or if the database
 * can't be reached, or is empty) falls back to the arrays in config/club.ts,
 * so the homepage never breaks.
 */
export async function getPublicLeaders(): Promise<PublicLeaders> {
  if (!isSupabaseConfigured()) return fallback;

  try {
    const { data, error } = await createPublicClient()
      .from("leaders")
      .select("section, name, role, note, sort_order")
      .order("sort_order", { ascending: true });

    if (error || !data || data.length === 0) {
      if (error) console.error("[leaders] Supabase read failed, using fallback:", error.message);
      return fallback;
    }

    return {
      current: data
        .filter((r) => r.section === "current")
        .map((r) => ({ name: r.name, role: r.role, bio: r.note ?? undefined })),
      past: data
        .filter((r) => r.section === "past")
        .map((r) => ({ name: r.name, role: r.role, note: r.note ?? undefined })),
    };
  } catch (err) {
    console.error("[leaders] Supabase unreachable, using fallback:", err);
    return fallback;
  }
}
