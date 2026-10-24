import { ActionForm, Field } from "@/components/admin/ActionForm";
import { createAdmin, removeAdmin, resetAdminPassword, updateAdminRole } from "@/app/admin/actions";

export type AdminListItem = {
  user_id: string;
  email: string;
  role: "owner" | "editor";
};

function RoleSelect({ name, defaultValue }: { name: string; defaultValue?: string }) {
  return (
    <label className="flex flex-col gap-1 text-xs text-slate">
      <span className="font-mono uppercase tracking-wide">Role</span>
      <select
        name={name}
        defaultValue={defaultValue ?? "editor"}
        className="rounded-[var(--radius-sm)] border border-slate-soft bg-white px-3 py-2 text-sm text-ink focus:border-navy focus:outline-none"
      >
        <option value="editor">Editor: leadership lists only</option>
        <option value="owner">Owner: everything, incl. admins</option>
      </select>
    </label>
  );
}

/** Owners only: see, add, change and remove admin accounts. */
export function AdminManager({
  admins,
  currentUserId,
  serviceKeyConfigured,
}: {
  admins: AdminListItem[];
  currentUserId: string;
  serviceKeyConfigured: boolean;
}) {
  if (!serviceKeyConfigured) {
    return (
      <p className="text-sm text-timer-red">
        Add the SUPABASE_SERVICE_ROLE_KEY environment variable to manage admins from here.
      </p>
    );
  }

  return (
    <div className="space-y-3">
      {admins.map((admin) => {
        const isYou = admin.user_id === currentUserId;
        return (
          <div
            key={admin.user_id}
            className="rounded-[var(--radius-md)] border border-slate-soft/70 bg-white/70 p-4"
          >
            <p className="text-sm font-semibold break-all">
              {admin.email}
              {isYou && <span className="ml-2 font-mono text-xs text-slate">(you)</span>}
            </p>

            {isYou ? (
              <p className="mt-1 font-mono text-xs uppercase text-gold">{admin.role}</p>
            ) : (
              <div className="mt-3 flex flex-wrap items-start gap-3">
                <ActionForm action={updateAdminRole} submitLabel="Update role" variant="secondary">
                  <input type="hidden" name="userId" value={admin.user_id} />
                  <RoleSelect name="role" defaultValue={admin.role} />
                </ActionForm>

                <details>
                  <summary className="cursor-pointer list-none rounded-[var(--radius-sm)] border border-navy/25 bg-white px-3.5 py-2 text-sm font-semibold text-navy hover:border-navy">
                    Reset password…
                  </summary>
                  <div className="mt-2 rounded-[var(--radius-sm)] bg-cream-dim p-3">
                    <ActionForm action={resetAdminPassword} submitLabel="Set password" variant="secondary">
                      <input type="hidden" name="userId" value={admin.user_id} />
                      <Field label="New password" name="password" type="text" maxLength={72} autoComplete="off" />
                    </ActionForm>
                  </div>
                </details>

                <ActionForm
                  action={removeAdmin}
                  submitLabel="Remove access"
                  pendingLabel="Removing…"
                  variant="danger"
                  confirmMessage={`Remove admin access for ${admin.email}? Their login will be deleted.`}
                  className="ml-auto"
                >
                  <input type="hidden" name="userId" value={admin.user_id} />
                </ActionForm>
              </div>
            )}
          </div>
        );
      })}

      <div className="rounded-[var(--radius-md)] border border-dashed border-navy/30 bg-cream-dim/60 p-4">
        <p className="mb-1 font-display text-base">Add an admin</p>
        <p className="mb-3 text-xs text-slate">
          Creates their login. Send them the link and temporary password privately; they can
          change the password after signing in.
        </p>
        <ActionForm action={createAdmin} submitLabel="Create admin" pendingLabel="Creating…">
          <Field label="Email" name="email" type="email" required autoComplete="off" className="w-full sm:w-64" />
          <Field label="Temporary password" name="password" type="text" required maxLength={72} autoComplete="off" className="w-full sm:w-48" />
          <RoleSelect name="role" />
        </ActionForm>
      </div>
    </div>
  );
}
