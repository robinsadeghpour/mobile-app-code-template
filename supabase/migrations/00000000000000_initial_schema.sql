-- The schema a fresh project starts from.
--
-- One migration on purpose: a new project should begin with an empty history,
-- not this template's. Add your own migrations after this one, and never edit
-- this file once it has been pushed anywhere.
--
-- What it creates:
--   - `profiles`, one row per user, created automatically on sign-up
--   - row level security on it, so a user can read and write only their own row
--   - the public `avatars` bucket with owner-scoped storage policies
--
-- Uses the built-in gen_random_uuid() (Postgres 13+); no extension needed.

-- RLS on storage.objects is already enabled by hosted Supabase and the
-- migration role does not own that table, so this file never runs
-- `alter table storage.objects enable row level security` (42501 on remote).
-- It only adds policies.

-- ---------------------------------------------------------
-- Profiles
-- ---------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- Three policies rather than one `for all`, because the thing worth being
-- explicit about is that there is no policy allowing a user to read another
-- user's row. A query that happens to filter is not the same as a policy.
create policy "profiles owner select" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "profiles owner insert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles owner update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- The row is created by a trigger rather than by the app, so a profile exists
-- from the first moment a session does. Doing it client side leaves a window
-- where the user is signed in and has no row, and every screen has to handle it.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, new.raw_user_meta_data ->> 'display_name');
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Storage: avatars (public) — one object per user
-- ---------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- The client writes exactly one object per user, `avatars/{auth.uid()}.<ext>`
-- (src/lib/storage/avatarConstants.ts), so the write policies match that name
-- and nothing else. Anything looser lets any authenticated user litter a
-- public bucket with arbitrary names, which account deletion then has to walk.
create policy "Users can upload their own avatars"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id and
  name ~ ('^avatars/' || auth.uid()::text || '\.[a-z0-9]+$')
);

-- Postgres would reuse `using` as the check for the new row, but a policy that
-- decides what may be written says so.
create policy "Users can update their own avatars"
on storage.objects
for update
to authenticated
using (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id and
  name ~ ('^avatars/' || auth.uid()::text || '\.[a-z0-9]+$')
)
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id and
  name ~ ('^avatars/' || auth.uid()::text || '\.[a-z0-9]+$')
);

create policy "Anyone can view avatars"
on storage.objects
for select
to authenticated, anon
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = 'avatars'
);

create policy "Users can delete their own avatars"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars' and
  (storage.foldername(name))[1] = 'avatars' and
  auth.uid()::text = owner_id
);