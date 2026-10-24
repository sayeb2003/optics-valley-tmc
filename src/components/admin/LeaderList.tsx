import { ActionForm, Field } from "@/components/admin/ActionForm";
import {
  addLeader,
  deleteLeader,
  moveLeader,
  moveToPast,
  updateLeader,
} from "@/app/admin/actions";
import type { LeaderRow, LeaderSection } from "@/lib/leaders";

type LeaderListProps = {
  section: LeaderSection;
  rows: LeaderRow[];
};

const copy = {
  current: {
    noteLabel: "Short bio (optional)",
    notePlaceholder: "Shown under their role",
    rolePlaceholder: "e.g. VP Education (VPE)",
    addTitle: "Add an officer",
  },
  past: {
    noteLabel: "Term / note (optional)",
    notePlaceholder: "e.g. Jul–Dec 2026",
    rolePlaceholder: "e.g. Former VPE",
    addTitle: "Add a past leader",
  },
} as const;

/** One editable list (current officers OR past leaders) on the admin page. */
export function LeaderList({ section, rows }: LeaderListProps) {
  const text = copy[section];

  return (
    <div className="space-y-3">
      {rows.length === 0 && (
        <p className="text-sm text-slate">No entries yet. Add one below.</p>
      )}

      {rows.map((row, i) => (
        <div
          key={row.id}
          className="rounded-[var(--radius-md)] border border-slate-soft/70 bg-white/70 p-4"
        >
          <ActionForm action={updateLeader} submitLabel="Save">
            <input type="hidden" name="id" value={row.id} />
            <Field label="Name" name="name" defaultValue={row.name} maxLength={80} required className="w-full sm:w-40" />
            <Field label="Role" name="role" defaultValue={row.role} maxLength={80} required className="w-full sm:w-56" />
            <Field
              label={text.noteLabel}
              name="note"
              defaultValue={row.note}
              placeholder={text.notePlaceholder}
              maxLength={200}
              className="w-full sm:flex-1 sm:min-w-48"
            />
          </ActionForm>

          <div className="mt-3 flex flex-wrap items-start gap-2 border-t border-slate-soft/50 pt-3">
            <ActionForm action={moveLeader} submitLabel="↑ Up" pendingLabel="…" variant="secondary">
              <input type="hidden" name="id" value={row.id} />
              <input type="hidden" name="section" value={section} />
              <input type="hidden" name="direction" value="up" />
            </ActionForm>
            <ActionForm action={moveLeader} submitLabel="↓ Down" pendingLabel="…" variant="secondary">
              <input type="hidden" name="id" value={row.id} />
              <input type="hidden" name="section" value={section} />
              <input type="hidden" name="direction" value="down" />
            </ActionForm>

            {section === "current" && (
              <details className="group">
                <summary className="cursor-pointer list-none rounded-[var(--radius-sm)] border border-navy/25 bg-white px-3.5 py-2 text-sm font-semibold text-navy hover:border-navy">
                  Move to past…
                </summary>
                <div className="mt-2 rounded-[var(--radius-sm)] bg-cream-dim p-3">
                  <ActionForm
                    action={moveToPast}
                    submitLabel="Move to Past Leadership"
                    pendingLabel="Moving…"
                    confirmMessage={`Move ${row.name} (${row.role}) to Past Leadership?`}
                  >
                    <input type="hidden" name="id" value={row.id} />
                    <Field label="Term served (optional)" name="term" placeholder="e.g. Jul–Dec 2026" maxLength={200} />
                  </ActionForm>
                </div>
              </details>
            )}

            <ActionForm
              action={deleteLeader}
              submitLabel="Delete"
              pendingLabel="Deleting…"
              variant="danger"
              confirmMessage={`Delete ${row.name} (${row.role})? This can't be undone.`}
              className="ml-auto"
            >
              <input type="hidden" name="id" value={row.id} />
            </ActionForm>
          </div>
          <p className="sr-only">Position {i + 1} of {rows.length}</p>
        </div>
      ))}

      <div className="rounded-[var(--radius-md)] border border-dashed border-navy/30 bg-cream-dim/60 p-4">
        <p className="mb-3 font-display text-base">{text.addTitle}</p>
        <ActionForm action={addLeader} submitLabel="Add" pendingLabel="Adding…">
          <input type="hidden" name="section" value={section} />
          <Field label="Name" name="name" maxLength={80} required className="w-full sm:w-40" />
          <Field label="Role" name="role" placeholder={text.rolePlaceholder} maxLength={80} required className="w-full sm:w-56" />
          <Field
            label={text.noteLabel}
            name="note"
            placeholder={text.notePlaceholder}
            maxLength={200}
            className="w-full sm:flex-1 sm:min-w-48"
          />
        </ActionForm>
      </div>
    </div>
  );
}
