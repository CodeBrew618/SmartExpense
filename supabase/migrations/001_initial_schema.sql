-- ============================================================
-- Migration 001 — Initial Schema
-- Created: 2026-03-25
-- Description: Profiles, categories, expenses tables with RLS
--              and auto-trigger functions.
-- ============================================================


-- ------------------------------------------------------------
-- Profiles
-- ------------------------------------------------------------

create table public.profiles (
  id uuid references auth.users on delete cascade primary key,
  full_name text,
  avatar_url text,
  currency text default 'USD',
  created_at timestamptz default now()
);

-- Auto-create profile row when a new user signs up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name)
  values (new.id, new.raw_user_meta_data->>'full_name');
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;

create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);


-- ------------------------------------------------------------
-- Categories
-- ------------------------------------------------------------

create table public.categories (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  name text not null,
  icon text default '💰',
  color text default '#6366f1',
  is_default boolean default false,
  created_at timestamptz default now()
);

-- RLS
alter table public.categories enable row level security;

create policy "Users can view own categories" on public.categories
  for select using (auth.uid() = user_id);

create policy "Users can insert own categories" on public.categories
  for insert with check (auth.uid() = user_id);

create policy "Users can update own categories" on public.categories
  for update using (auth.uid() = user_id);

create policy "Users can delete own categories" on public.categories
  for delete using (auth.uid() = user_id);


-- ------------------------------------------------------------
-- Expenses
-- ------------------------------------------------------------

create table public.expenses (
  id uuid default gen_random_uuid() primary key,
  user_id uuid references auth.users on delete cascade not null,
  category_id uuid references public.categories on delete set null,
  amount numeric(12, 2) not null check (amount > 0),
  currency text default 'USD',
  date date not null default current_date,
  note text,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- Auto-update updated_at on every edit
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger on_expense_updated
  before update on public.expenses
  for each row execute procedure public.handle_updated_at();

-- RLS
alter table public.expenses enable row level security;

create policy "Users can view own expenses" on public.expenses
  for select using (auth.uid() = user_id);

create policy "Users can insert own expenses" on public.expenses
  for insert with check (auth.uid() = user_id);

create policy "Users can update own expenses" on public.expenses
  for update using (auth.uid() = user_id);

create policy "Users can delete own expenses" on public.expenses
  for delete using (auth.uid() = user_id);


-- ------------------------------------------------------------
-- Default categories (seeded per user by the app on first login)
-- ------------------------------------------------------------
-- Not inserted here — the app inserts these for each user via
-- useCategories hook (seedCategories). Listed here for reference:
--
--   Food & Dining  🍔  #f97316
--   Transport      🚗  #3b82f6
--   Housing        🏠  #8b5cf6
--   Entertainment  🎬  #ec4899
--   Health         💊  #10b981
--   Shopping       🛍️  #f59e0b
--   Other          📦  #6b7280
-- ------------------------------------------------------------
