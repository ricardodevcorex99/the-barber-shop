-- ============================================================================
-- THE BARBER SHOP — Supabase Schema
-- Run this in: Supabase Dashboard → SQL Editor → New query → Run
-- ============================================================================

-- Bookings table (folio is the primary key, matching the client-side TBS-XXXXX)
create table if not exists public.bookings (
  id             text primary key,
  folio          text not null,
  name           text not null,
  phone          text not null,
  email          text,
  date           text not null,
  time           text,
  preference     text,
  barber         text not null,
  services       jsonb not null default '[]'::jsonb,
  total          numeric not null default 0,
  status         text not null default 'pending',
  whatsapp_message text,
  whatsapp_phone text,
  created_at     timestamptz not null default now(),
  updated_at     timestamptz not null default now()
);

-- Indexes for the admin panel filters
create index if not exists bookings_date_idx     on public.bookings (date);
create index if not exists bookings_status_idx   on public.bookings (status);
create index if not exists bookings_barber_idx   on public.bookings (barber);
create index if not exists bookings_created_idx  on public.bookings (created_at desc);

-- Row Level Security: block public access (we talk to the DB from serverless
-- functions using the service role key, which bypasses RLS).
alter table public.bookings enable row level security;

-- ============================================================================
-- AUTHENTICATION & PROFILES UPDATE
-- ============================================================================

-- 1. Profiles table
create table if not exists public.profiles (
  id uuid references auth.users(id) primary key,
  full_name text,
  phone text,
  avatar_url text,
  created_at timestamptz not null default now()
);

-- Enable RLS on profiles
alter table public.profiles enable row level security;

create policy "Public profiles are viewable by everyone."
  on public.profiles for select
  using ( true );

create policy "Users can insert their own profile."
  on public.profiles for insert
  with check ( auth.uid() = id );

create policy "Users can update own profile."
  on public.profiles for update
  using ( auth.uid() = id );

-- 2. Trigger for new user signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = ''
as $$
begin
  insert into public.profiles (id, full_name, avatar_url)
  values (
    new.id,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$;

-- Trigger execution
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- 3. Link Bookings to Auth Users
alter table public.bookings 
add column if not exists user_id uuid references auth.users(id);

-- 4. RLS for Bookings for Authenticated Users (and Admin fallback)
-- Allow users to see their own bookings
create policy "Users can view own bookings"
  on public.bookings for select
  using ( auth.uid() = user_id );

-- Allow users to insert their own bookings
create policy "Users can insert own bookings"
  on public.bookings for insert
  with check ( auth.uid() = user_id );

-- (Note: The existing Vercel Serverless Functions use the Service Role Key, 
-- which bypasses RLS automatically, so guest reservations will continue to work normally).
