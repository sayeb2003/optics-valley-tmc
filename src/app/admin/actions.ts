"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAdminContext, type AdminContext } from "@/lib/admin-auth";
import type { LeaderSection } from "@/lib/leaders";
import { isSupabaseConfigured } from "@/lib/supabase/env";
import { createServiceClient, createSessionClient } from "@/lib/supabase/server";

/**
 * Every action here re-checks who is signed in on the SERVER before doing
 * anything. The database's own security rules (supabase/schema.sql) check
 * again, so even a hand-crafted request can't get around them.
 */

export type ActionState = { ok: boolean; message: string } | null;

const LIMITS = { name: 80, role: 80, note: 200 } as const;

// ---------- small helpers ------------------------------------------------

function text(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value.trim() : "";
}

function fail(message: string): ActionState {
  return { ok: false, message };
}

function done(message = "Saved."): ActionState {
  return { ok: true, message };
}

/** Refresh the public homepage + the admin page after a leadership change. */
function refreshLeaders() {
  revalidatePath("/");
  revalidatePath("/admin");
}

async function requireAdmin(): Promise<AdminContext | null> {
  if (!isSupabaseConfigured()) return null;
  return getAdminContext();
}

function validateLeaderFields(name: string, role: string, note: string): string | null {
  if (!name) return "Name is required.";
  if (!role) return "Role is required.";
  if (name.length > LIMITS.name) return `Name must be ${LIMITS.name} characters or fewer.`;
  if (role.length > LIMITS.role) return `Role must be ${LIMITS.role} characters or fewer.`;
  if (note.length > LIMITS.note) return `Note must be ${LIMITS.note} characters or fewer.`;
  return null;
}

function parseSection(value: string): LeaderSection | null {
  return value === "current" || value === "past" ? value : null;
}

// ---------- sign in / out ------------------------------------------------

export async function login(_prev: ActionState, formData: FormData): Promise<ActionState> {
  if (!isSupabaseConfigured()) return fail("The admin portal isn't set up yet.");

  const email = text(formData, "email").toLowerCase();
  const password = typeof formData.get("password") === "string" ? (formData.get("password") as string) : "";
  if (!email || !password) return fail("Enter your email and password.");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return fail("Email or password is incorrect.");

  // A valid login isn't enough — the account must also be on the admins list.
  const ctx = await getAdminContext();
  if (!ctx) {
    await supabase.auth.signOut();
    return fail("This account doesn't have admin access.");
  }

  redirect("/admin");
}

export async function logout(): Promise<void> {
  if (isSupabaseConfigured()) {
    const supabase = await createSessionClient();
    await supabase.auth.signOut();
  }
  redirect("/admin/login");
}

// ---------- leaders: add / edit / delete --------------------------------

export async function addLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const section = parseSection(text(formData, "section"));
  const name = text(formData, "name");
  const role = text(formData, "role");
  const note = text(formData, "note");
  if (!section) return fail("Unknown list.");
  const invalid = validateLeaderFields(name, role, note);
  if (invalid) return fail(invalid);

  const supabase = await createSessionClient();
  const { data: last } = await supabase
    .from("leaders")
    .select("sort_order")
    .eq("section", section)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const { error } = await supabase.from("leaders").insert({
    section,
    name,
    role,
    note: note || null,
    sort_order: (last?.sort_order ?? 0) + 10,
    updated_by: ctx.userId,
  });
  if (error) return fail("Couldn't add: " + error.message);

  refreshLeaders();
  return done(`Added ${name}.`);
}

export async function updateLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const id = text(formData, "id");
  const name = text(formData, "name");
  const role = text(formData, "role");
  const note = text(formData, "note");
  if (!id) return fail("Missing entry.");
  const invalid = validateLeaderFields(name, role, note);
  if (invalid) return fail(invalid);

  const supabase = await createSessionClient();
  const { error } = await supabase
    .from("leaders")
    .update({ name, role, note: note || null, updated_at: new Date().toISOString(), updated_by: ctx.userId })
    .eq("id", id);
  if (error) return fail("Couldn't save: " + error.message);

  refreshLeaders();
  return done();
}

export async function deleteLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const id = text(formData, "id");
  if (!id) return fail("Missing entry.");

  const supabase = await createSessionClient();
  const { error } = await supabase.from("leaders").delete().eq("id", id);
  if (error) return fail("Couldn't delete: " + error.message);

  refreshLeaders();
  return done("Deleted.");
}

/** Move an entry one place up or down within its list. */
export async function moveLeader(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const id = text(formData, "id");
  const direction = text(formData, "direction");
  const section = parseSection(text(formData, "section"));
  if (!id || !section || (direction !== "up" && direction !== "down")) return fail("Invalid move.");

  const supabase = await createSessionClient();
  const { data: rows, error } = await supabase
    .from("leaders")
    .select("id, sort_order")
    .eq("section", section)
    .order("sort_order", { ascending: true });
  if (error || !rows) return fail("Couldn't reorder.");

  const index = rows.findIndex((r) => r.id === id);
  const target = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || target < 0 || target >= rows.length) return done("Already at the edge.");

  // Swap, then renumber the whole list cleanly (10, 20, 30, …).
  const ordered = [...rows];
  [ordered[index], ordered[target]] = [ordered[target], ordered[index]];
  for (let i = 0; i < ordered.length; i++) {
    const newOrder = (i + 1) * 10;
    if (ordered[i].sort_order !== newOrder) {
      const { error: updateError } = await supabase
        .from("leaders")
        .update({ sort_order: newOrder })
        .eq("id", ordered[i].id);
      if (updateError) return fail("Couldn't reorder: " + updateError.message);
    }
  }

  refreshLeaders();
  return done("Moved.");
}

/** Move a current officer into the Past Leadership list (e.g. at term end). */
export async function moveToPast(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const id = text(formData, "id");
  const term = text(formData, "term");
  if (!id) return fail("Missing entry.");
  if (term.length > LIMITS.note) return fail(`Term must be ${LIMITS.note} characters or fewer.`);

  const supabase = await createSessionClient();
  const { data: row } = await supabase.from("leaders").select("role").eq("id", id).maybeSingle();
  if (!row) return fail("Entry not found.");

  const { data: last } = await supabase
    .from("leaders")
    .select("sort_order")
    .eq("section", "past")
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();

  const pastRole = /^former\s/i.test(row.role) ? row.role : `Former ${row.role}`;
  const { error } = await supabase
    .from("leaders")
    .update({
      section: "past",
      role: pastRole.slice(0, LIMITS.role),
      note: term || null,
      sort_order: (last?.sort_order ?? 0) + 10,
      updated_at: new Date().toISOString(),
      updated_by: ctx.userId,
    })
    .eq("id", id);
  if (error) return fail("Couldn't move: " + error.message);

  refreshLeaders();
  return done("Moved to Past Leadership.");
}

// ---------- your own account --------------------------------------------

export async function changePassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const ctx = await requireAdmin();
  if (!ctx) return fail("Your session has expired. Please sign in again.");

  const password = String(formData.get("password") ?? "");
  const confirm = String(formData.get("confirm") ?? "");
  if (password.length < 8) return fail("Use at least 8 characters.");
  if (password !== confirm) return fail("The two passwords don't match.");

  const supabase = await createSessionClient();
  const { error } = await supabase.auth.updateUser({ password });
  if (error) return fail("Couldn't change password: " + error.message);

  return done("Password changed.");
}

// ---------- owners only: manage who has admin access --------------------

async function requireOwner(): Promise<
  { ctx: AdminContext; service: NonNullable<ReturnType<typeof createServiceClient>> } | { error: string }
> {
  const ctx = await requireAdmin();
  if (!ctx) return { error: "Your session has expired. Please sign in again." };
  if (ctx.role !== "owner") return { error: "Only owners can manage admins." };
  const service = createServiceClient();
  if (!service) return { error: "SUPABASE_SERVICE_ROLE_KEY isn't set, so admins can't be managed yet." };
  return { ctx, service };
}

function parseRole(value: string): "owner" | "editor" | null {
  return value === "owner" || value === "editor" ? value : null;
}

export async function createAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireOwner();
  if ("error" in auth) return fail(auth.error);

  const email = text(formData, "email").toLowerCase();
  const password = String(formData.get("password") ?? "");
  const role = parseRole(text(formData, "role"));
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return fail("Enter a valid email.");
  if (password.length < 8) return fail("Temporary password must be at least 8 characters.");
  if (!role) return fail("Choose a role.");

  const { data: created, error } = await auth.service.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !created.user) {
    return fail("Couldn't create the account: " + (error?.message ?? "unknown error"));
  }

  const { error: insertError } = await auth.service
    .from("admins")
    .insert({ user_id: created.user.id, email, role });
  if (insertError) {
    // Roll back so we don't leave a login with no admin access behind.
    await auth.service.auth.admin.deleteUser(created.user.id);
    return fail("Couldn't grant access: " + insertError.message);
  }

  revalidatePath("/admin");
  return done(`Added ${email} as ${role}. Share the temporary password with them privately.`);
}

export async function updateAdminRole(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireOwner();
  if ("error" in auth) return fail(auth.error);

  const userId = text(formData, "userId");
  const role = parseRole(text(formData, "role"));
  if (!userId || !role) return fail("Invalid request.");
  // Owners can't change their own role, so there is always at least one owner.
  if (userId === auth.ctx.userId) return fail("You can't change your own role.");

  const { error } = await auth.service.from("admins").update({ role }).eq("user_id", userId);
  if (error) return fail("Couldn't update role: " + error.message);

  revalidatePath("/admin");
  return done("Role updated.");
}

export async function resetAdminPassword(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireOwner();
  if ("error" in auth) return fail(auth.error);

  const userId = text(formData, "userId");
  const password = String(formData.get("password") ?? "");
  if (!userId) return fail("Invalid request.");
  if (password.length < 8) return fail("New password must be at least 8 characters.");

  const { data: target } = await auth.service.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (!target) return fail("That person isn't an admin.");

  const { error } = await auth.service.auth.admin.updateUserById(userId, { password });
  if (error) return fail("Couldn't reset password: " + error.message);

  return done("Password reset. Share it with them privately.");
}

export async function removeAdmin(_prev: ActionState, formData: FormData): Promise<ActionState> {
  const auth = await requireOwner();
  if ("error" in auth) return fail(auth.error);

  const userId = text(formData, "userId");
  if (!userId) return fail("Invalid request.");
  if (userId === auth.ctx.userId) return fail("You can't remove yourself. Ask another owner.");

  const { data: target } = await auth.service.from("admins").select("user_id").eq("user_id", userId).maybeSingle();
  if (!target) return fail("That person isn't an admin.");

  // Deleting the login also removes their admins row (ON DELETE CASCADE).
  const { error } = await auth.service.auth.admin.deleteUser(userId);
  if (error) return fail("Couldn't remove: " + error.message);

  revalidatePath("/admin");
  return done("Access removed.");
}
