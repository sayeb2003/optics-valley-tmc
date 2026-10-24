"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { login, type ActionState } from "@/app/admin/actions";

function SignInButton() {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className="w-full rounded-[var(--radius-pill)] bg-gold px-6 py-3 text-sm font-semibold text-ink transition-colors hover:bg-gold-soft disabled:opacity-60"
    >
      {pending ? "Signing in…" : "Sign in"}
    </button>
  );
}

export function LoginForm() {
  const [state, formAction] = useActionState<ActionState, FormData>(login, null);

  return (
    <form action={formAction} className="space-y-4">
      <label className="block text-sm">
        <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-slate">Email</span>
        <input
          name="email"
          type="email"
          required
          autoComplete="username"
          className="w-full rounded-[var(--radius-sm)] border border-slate-soft bg-white px-3 py-2.5 focus:border-navy focus:outline-none"
        />
      </label>
      <label className="block text-sm">
        <span className="mb-1 block font-mono text-xs uppercase tracking-wide text-slate">Password</span>
        <input
          name="password"
          type="password"
          required
          autoComplete="current-password"
          className="w-full rounded-[var(--radius-sm)] border border-slate-soft bg-white px-3 py-2.5 focus:border-navy focus:outline-none"
        />
      </label>
      {state && !state.ok && (
        <p role="alert" className="text-sm text-timer-red">
          {state.message}
        </p>
      )}
      <SignInButton />
    </form>
  );
}
