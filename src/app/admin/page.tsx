import Link from "next/link";
import { redirect } from "next/navigation";
import { ActionForm, Field } from "@/components/admin/ActionForm";
import { changePassword, logout } from "@/app/admin/actions";
import { AdminManager, type AdminListItem } from "@/components/admin/AdminManager";
import { LeaderList } from "@/components/admin/LeaderList";
import { getAdminContext } from "@/lib/admin-auth";
import type { LeaderRow } from "@/lib/leaders";
import { supabaseServiceKey } from "@/lib/supabase/env";
import { createSessionClient } from "@/lib/supabase/server";
import { club } from "@/config/club";

function Panel({ title, description, children }: { title: string; description?: string; children: React.ReactNode }) {
  return (
    <section className="rounded-[var(--radius-lg)] border border-slate-soft/60 bg-white/50 p-5 md:p-7">
      <h2 className="font-display text-2xl font-light">{title}</h2>
      {description && <p className="mt-1 mb-5 text-sm text-slate">{description}</p>}
      {!description && <div className="mb-5" />}
      {children}
    </section>
  );
}

export default async function AdminDashboard() {
  const ctx = await getAdminContext();
  if (!ctx) redirect("/admin/login");

  const supabase = await createSessionClient();
  const { data: leaderData } = await supabase
    .from("leaders")
    .select("id, section, name, role, note, sort_order")
    .order("sort_order", { ascending: true });
  const leaders = (leaderData ?? []) as LeaderRow[];

  let admins: AdminListItem[] = [];
  if (ctx.role === "owner") {
    const { data } = await supabase.from("admins").select("user_id, email, role").order("created_at");
    admins = (data ?? []) as AdminListItem[];
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-8 md:px-6 md:py-12">
      <header className="mb-8 flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">{club.shortName} · Admin</p>
          <p className="mt-1 text-sm">
            Signed in as <span className="font-semibold break-all">{ctx.email}</span>{" "}
            <span className="ml-1 rounded-[var(--radius-pill)] bg-gold/20 px-2 py-0.5 font-mono text-xs uppercase text-ink">
              {ctx.role}
            </span>
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/#leadership" className="text-sm text-navy underline-offset-4 hover:underline">
            View site ↗
          </Link>
          <form action={logout}>
            <button className="rounded-[var(--radius-sm)] border border-navy/25 bg-white px-3.5 py-2 text-sm font-semibold text-navy hover:border-navy">
              Sign out
            </button>
          </form>
        </div>
      </header>

      <div className="space-y-8">
        <Panel
          title="Current officers"
          description="Shown as cards in the Leadership section of the homepage, in this order. Changes go live within a few seconds."
        >
          <LeaderList section="current" rows={leaders.filter((l) => l.section === "current")} />
        </Panel>

        <Panel
          title="Past leadership"
          description="The 'Past Leadership' line under the cards. Use 'Move to past' on an officer when their term ends, or add earlier leaders here."
        >
          <LeaderList section="past" rows={leaders.filter((l) => l.section === "past")} />
        </Panel>

        {ctx.role === "owner" && (
          <Panel
            title="Admins"
            description="Owners can do everything, including managing admins. Editors can only change the leadership lists above."
          >
            <AdminManager
              admins={admins}
              currentUserId={ctx.userId}
              serviceKeyConfigured={Boolean(supabaseServiceKey)}
            />
          </Panel>
        )}

        <Panel title="Your password">
          <ActionForm action={changePassword} submitLabel="Change password" pendingLabel="Changing…">
            <Field label="New password" name="password" type="password" required autoComplete="new-password" className="w-full sm:w-56" />
            <Field label="Repeat new password" name="confirm" type="password" required autoComplete="new-password" className="w-full sm:w-56" />
          </ActionForm>
        </Panel>
      </div>
    </main>
  );
}
