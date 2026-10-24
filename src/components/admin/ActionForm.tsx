"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { cn } from "@/lib/utils";
import type { ActionState } from "@/app/admin/actions";

type ServerAction = (prev: ActionState, formData: FormData) => Promise<ActionState>;

type ActionFormProps = {
  action: ServerAction;
  children: React.ReactNode;
  submitLabel: string;
  pendingLabel?: string;
  /** Shown in a browser confirm box before submitting (for deletes etc.). */
  confirmMessage?: string;
  variant?: "primary" | "secondary" | "danger";
  className?: string;
  /** Where the button sits relative to the fields. */
  layout?: "inline" | "stacked";
};

const buttonStyles = {
  primary: "bg-navy text-cream hover:bg-navy-deep",
  secondary: "bg-white text-navy border border-navy/25 hover:border-navy",
  danger: "bg-white text-timer-red border border-timer-red/40 hover:bg-timer-red hover:text-white",
};

function SubmitButton({ label, pendingLabel, variant }: { label: string; pendingLabel?: string; variant: keyof typeof buttonStyles }) {
  const { pending } = useFormStatus();
  return (
    <button
      type="submit"
      disabled={pending}
      className={cn(
        "rounded-[var(--radius-sm)] px-3.5 py-2 text-sm font-semibold transition-colors disabled:opacity-60 whitespace-nowrap",
        buttonStyles[variant]
      )}
    >
      {pending ? pendingLabel ?? "Saving…" : label}
    </button>
  );
}

/**
 * A form wired to a server action, with a pending state and a success/error
 * message underneath. Works without JavaScript too (plain form POST).
 */
export function ActionForm({
  action,
  children,
  submitLabel,
  pendingLabel,
  confirmMessage,
  variant = "primary",
  className,
  layout = "inline",
}: ActionFormProps) {
  const [state, formAction] = useActionState(action, null);

  return (
    <form
      action={formAction}
      className={className}
      onSubmit={(e) => {
        if (confirmMessage && !window.confirm(confirmMessage)) e.preventDefault();
      }}
    >
      <div className={cn(layout === "inline" ? "flex flex-wrap items-end gap-2" : "flex flex-col gap-3")}>
        {children}
        <div>
          <SubmitButton label={submitLabel} pendingLabel={pendingLabel} variant={variant} />
        </div>
      </div>
      {state?.message && (
        <p
          role="status"
          className={cn("mt-2 text-xs", state.ok ? "text-timer-green" : "text-timer-red")}
        >
          {state.message}
        </p>
      )}
    </form>
  );
}

/** Labelled text input used across admin forms. */
export function Field({
  label,
  name,
  defaultValue,
  placeholder,
  type = "text",
  maxLength,
  required,
  className,
  autoComplete,
}: {
  label: string;
  name: string;
  defaultValue?: string | null;
  placeholder?: string;
  type?: string;
  maxLength?: number;
  required?: boolean;
  className?: string;
  autoComplete?: string;
}) {
  return (
    <label className={cn("flex flex-col gap-1 text-xs text-slate", className)}>
      <span className="font-mono uppercase tracking-wide">{label}</span>
      <input
        type={type}
        name={name}
        defaultValue={defaultValue ?? ""}
        placeholder={placeholder}
        maxLength={maxLength}
        required={required}
        autoComplete={autoComplete}
        className="rounded-[var(--radius-sm)] border border-slate-soft bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
      />
    </label>
  );
}
