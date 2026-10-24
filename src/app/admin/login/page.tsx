import { redirect } from "next/navigation";
import { LoginForm } from "@/components/admin/LoginForm";
import { getAdminContext } from "@/lib/admin-auth";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { club } from "@/config/club";

export default async function AdminLoginPage() {
  const configured = isSupabaseConfigured();
  if (configured && (await getAdminContext())) redirect("/admin");

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-16">
      <div className="w-full max-w-sm rounded-[var(--radius-lg)] border border-slate-soft/70 bg-white p-8 shadow-sm">
        <p className="font-mono text-xs uppercase tracking-[0.2em] text-slate">{club.shortName}</p>
        <h1 className="mt-2 mb-6 font-display text-3xl font-light">Admin sign in</h1>
        {configured ? (
          <LoginForm />
        ) : (
          <p className="text-sm text-slate">
            The admin portal isn&apos;t connected to its database yet. Follow the steps in{" "}
            <code className="font-mono text-xs">supabase/README.md</code> to set it up.
          </p>
        )}
      </div>
    </main>
  );
}
