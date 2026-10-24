-- =====================================================================
-- Optics Valley TMC — admin portal database schema
--
-- Run this ONCE in Supabase: Dashboard → SQL Editor → New query →
-- paste this whole file → Run. It is safe to re-run (it won't duplicate
-- seed rows if the leaders table already has data).
--
-- Security model (enforced by the database itself, not just the website):
--   * Anyone can READ leaders (the public homepage needs that).
--   * Only people listed in `admins` can add/edit/delete leaders.
--   * The `admins` list itself can only be changed by the server using
--     the secret service-role key, after the website checks the person
--     asking is an OWNER. Editors cannot add admins or change roles.
-- =====================================================================

-- ---------- Tables ----------------------------------------------------

create table if not exists public.admins (
  user_id    uuid primary key references auth.users (id) on delete cascade,
  email      text not null,
  role       text not null check (role in ('owner', 'editor')),
  created_at timestamptz not null default now()
);

create table if not exists public.leaders (
  id         uuid primary key default gen_random_uuid(),
  section    text not null check (section in ('current', 'past')),
  name       text not null check (char_length(name) between 1 and 80),
  role       text not null check (char_length(role) between 1 and 80),
  note       text check (note is null or char_length(note) <= 200),
  sort_order integer not null default 0,
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users (id) on delete set null
);

create index if not exists leaders_section_order_idx
  on public.leaders (section, sort_order);

-- ---------- Helper functions -------------------------------------------
-- SECURITY DEFINER so policies can check the admins table without the
-- policies on `admins` itself getting in the way (avoids recursion).

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (select 1 from public.admins where user_id = auth.uid());
$$;

create or replace function public.is_owner()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.admins where user_id = auth.uid() and role = 'owner'
  );
$$;

-- ---------- Row Level Security -----------------------------------------

alter table public.admins  enable row level security;
alter table public.leaders enable row level security;

drop policy if exists "leaders are public"        on public.leaders;
drop policy if exists "admins can add leaders"    on public.leaders;
drop policy if exists "admins can edit leaders"   on public.leaders;
drop policy if exists "admins can delete leaders" on public.leaders;
drop policy if exists "see own admin row; owners see all" on public.admins;

create policy "leaders are public"
  on public.leaders for select
  to anon, authenticated
  using (true);

create policy "admins can add leaders"
  on public.leaders for insert
  to authenticated
  with check (public.is_admin());

create policy "admins can edit leaders"
  on public.leaders for update
  to authenticated
  using (public.is_admin())
  with check (public.is_admin());

create policy "admins can delete leaders"
  on public.leaders for delete
  to authenticated
  using (public.is_admin());

-- Admins table: read-only through the normal API. No insert/update/delete
-- policies on purpose — only the server's service-role key can change it.
create policy "see own admin row; owners see all"
  on public.admins for select
  to authenticated
  using (user_id = auth.uid() or public.is_owner());

-- Explicit grants (newer Supabase projects don't always add these).
grant usage on schema public to anon, authenticated;
grant select on public.leaders to anon, authenticated;
grant insert, update, delete on public.leaders to authenticated;
grant select on public.admins to authenticated;
grant all on public.admins, public.leaders to service_role;
grant execute on function public.is_admin() to anon, authenticated;
grant execute on function public.is_owner() to anon, authenticated;

-- ---------- Seed data (only if the table is empty) ----------------------

insert into public.leaders (section, name, role, note, sort_order)
select * from (values
  ('current', 'Judy',     'President',                  null::text, 10),
  ('current', 'Forrest',  'Assistant to the President', null, 20),
  ('current', 'Tracy',    'Sergeant at Arms (SAA)',     null, 30),
  ('current', 'Sayeb',    'Secretary',                  null, 40),
  ('current', 'Kasun',    'VP Membership (VPM)',        null, 50),
  ('current', 'Albin',    'VP Public Relations (VPPR)', null, 60),
  ('current', 'Lexie',    'Assistant VPPR',             null, 70),
  ('current', 'Sophia',   'Assistant VPPR',             null, 80),
  ('current', 'Ryan',     'Assistant VPPR',             null, 85),
  ('current', 'Gondal',   'VP Education (VPE)',         null, 90),
  ('current', 'Daniel',   'Treasurer',                  null, 100),
  ('current', 'Margaret', 'Club Finance Advisor',       null, 110),
  ('current', 'Waqas',    'Club Mentor',                null, 120),
  ('past',    'Teddy',    'Former President', 'Also served as VPE (Jun–Jul 2026 and other full terms)', 10),
  ('past',    'Paul',     'Former President',           null, 20),
  ('past',    'Waqas',    'Former VPE',                 null, 30),
  ('past',    'Kasun',    'Former VPM',                 null, 40),
  ('past',    'Albin',    'Former VPPR',                null, 50),
  ('past',    'Sayeb',    'Former VPE',       'Jul–Aug 2026', 60),
  ('past',    'Gondal',   'Former Secretary', 'Jul–Aug 2026', 70)
) as seed (section, name, role, note, sort_order)
where not exists (select 1 from public.leaders);

-- ---------- Make yourself the first OWNER ------------------------------
-- 1. Dashboard → Authentication → Users → "Add user" → "Create new user"
--    (enter your email + a strong password, tick "Auto Confirm User").
-- 2. Then run this line, with YOUR email:
--
--   insert into public.admins (user_id, email, role)
--   select id, email, 'owner' from auth.users where email = 'you@example.com';
--
-- After that, add other admins from the website's /admin page instead.
