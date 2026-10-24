# Admin portal setup (one time, about 15 minutes)

The admin portal lives at **`/admin`** on your website (for example
`https://optics-valley-tmc.vercel.app/admin`). Nothing on the public site
links to it and search engines are told not to index it. Share the link
privately with the people you make admins.

Until these steps are done, the website keeps working exactly as before and
shows the leadership list from `src/config/club.ts`.

## 1. Create a free Supabase project

1. Go to https://supabase.com and sign up (GitHub sign-in is easiest).
2. **New project** → name it `optics-valley-tmc`.
3. **Database password:** generate one and save it in your password manager.
4. **Region:** choose **East US (North Virginia)**. That's next to Vercel's
   default server location, so saving changes is fastest.
5. Wait about 2 minutes for it to finish setting up.

## 2. Create the tables and security rules

1. Left sidebar → **SQL Editor** → **New query**.
2. Open `supabase/schema.sql` from this project, copy **all** of it, paste it in, click **Run**.
3. You should see "Success. No rows returned". Then **Table Editor** → `leaders`
   should list the current board and the past leaders.

## 3. Make yourself the first owner

1. Left sidebar → **Authentication** → **Users** → **Add user** → **Create new user**.
2. Enter your email and a strong password, tick **Auto Confirm User**, then **Create user**.
3. Back in **SQL Editor**, run this with **your** email:

   ```sql
   insert into public.admins (user_id, email, role)
   select id, email, 'owner' from auth.users where email = 'you@example.com';
   ```

4. Recommended: **Authentication** → **Sign In / Providers** → **Email** → turn
   **off** "Allow new users to sign up". Admins are only created by owners
   from the portal, so nobody should be able to sign themselves up.

## 4. Connect the website

In Supabase: **Project Settings** → **API Keys** (and **Data API** for the URL).

In Vercel: your project → **Settings** → **Environment Variables**. Add these three
for **Production, Preview and Development**:

| Name | Value |
|---|---|
| `SUPABASE_URL` | Project URL, like `https://abcd1234.supabase.co` |
| `SUPABASE_ANON_KEY` | the **Publishable** key (`sb_publishable_…`), or the legacy `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | the **Secret** key (`sb_secret_…`), or the legacy `service_role` key |

Then **Deployments** → the latest one → **⋯** → **Redeploy**. Environment variables
only take effect on a new deployment.

For local development, put the same three lines in a file called `.env.local`
in the project root. It's already git-ignored, so it won't be uploaded.

## 5. Sign in

Open `/admin` on your site and sign in. What you can do there:

| | Owner | Editor |
|---|---|---|
| Edit, add, delete and reorder current officers | ✓ | ✓ |
| Move an officer to Past Leadership (with their term) | ✓ | ✓ |
| Edit past leaders | ✓ | ✓ |
| Change own password | ✓ | ✓ |
| Add or remove admins, change roles, reset passwords | ✓ | ✗ |

Changes appear on the public homepage within a few seconds. No git push needed.

## Handing over when you leave the club

1. Add the new person as an **Owner** from the Admins panel.
2. They sign in, change their password, and then remove your access.

Owners can't demote or remove themselves, so the club can never be left
without an owner by accident.

## Safety notes

- The **Secret key** can bypass every rule. It lives only in Vercel and
  `.env.local`. If it ever leaks, rotate it in Supabase → API Keys.
- Security is enforced by the database itself (Row Level Security in
  `schema.sql`), not just by the website. Even someone who finds the `/admin`
  link can't change anything without an admin login.
- Free Supabase projects pause after 7 days with no activity at all. The public
  site still works when that happens, because it falls back to
  `src/config/club.ts`. To wake the project, click **Restore** in the Supabase
  dashboard.
