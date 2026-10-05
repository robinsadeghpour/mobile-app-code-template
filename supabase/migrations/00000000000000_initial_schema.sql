-- One migration on purpose: a new project starts with an empty history, not this
-- template's. Add your own after it, and never edit this file once it is pushed.

create table public.profiles (
  id uuid primary key references auth.users on delete cascade,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

-- No policy lets a user read another user's row. A query that happens to filter
-- is not the same as a policy.
create policy "profiles owner select" on public.profiles
  for select to authenticated using (auth.uid() = id);

create policy "profiles owner insert" on public.profiles
  for insert to authenticated with check (auth.uid() = id);

create policy "profiles owner update" on public.profiles
  for update to authenticated using (auth.uid() = id) with check (auth.uid() = id);

-- A trigger rather than the app creates the row, so a profile exists from the
-- first moment a session does.
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

insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true)
on conflict (id) do nothing;

-- RLS on storage.objects is already enabled by Supabase, and the migration role
-- does not own that table, so this file only adds policies.
--
-- The client writes exactly one object per user, `avatars/{auth.uid()}.<ext>`
-- (src/lib/storage/avatarConstants.ts). Matching that name and nothing else
-- stops any signed-in user from littering a public bucket.
create policy "Users can upload their own avatar"
on storage.objects
for insert
to authenticated
with check (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id and
  name ~ ('^avatars/' || auth.uid()::text || '\.[a-z0-9]+$')
);

create policy "Users can update their own avatar"
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

-- Public URLs of a public bucket need no policy. This one exists because an
-- upsert reads the object first, and it is owner-only so that nobody can list
-- the bucket and collect every user id from the file names.
create policy "Users can read their own avatar"
on storage.objects
for select
to authenticated
using (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id
);

create policy "Users can delete their own avatar"
on storage.objects
for delete
to authenticated
using (
  bucket_id = 'avatars' and
  auth.uid()::text = owner_id
);
