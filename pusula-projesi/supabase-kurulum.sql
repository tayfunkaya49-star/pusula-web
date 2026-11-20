-- PUSULA — SUPABASE VERİTABANI KURULUM DOSYASI
-- Kullanım: Supabase panelinde sol menüden "SQL Editor" -> "New query" açın,
-- bu dosyanın tamamını yapıştırıp "Run" (Çalıştır) düğmesine basın.

-- 1. Kullanıcı profilleri ve Pusula Pro üyelik durumu
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  full_name text,
  is_pro boolean default false,
  pro_expires_at timestamptz,
  created_at timestamptz default now()
);

-- 2. Her kullanıcının kendi görev, alışkanlık, not, fikir ve abonelik verileri
create table if not exists public.user_workspace (
  user_id uuid references auth.users on delete cascade primary key,
  scratchpad text default '',
  tasks jsonb default '[]'::jsonb,
  habits jsonb default '[]'::jsonb,
  ideas jsonb default '[]'::jsonb,
  subscriptions jsonb default '[]'::jsonb,
  watchlist jsonb default '[]'::jsonb,
  updated_at timestamptz default now()
);

-- 3. Güvenlik (Row Level Security): Her kullanıcı yalnızca kendi verisini görür
alter table public.profiles enable row level security;
alter table public.user_workspace enable row level security;

create policy "Kullanici kendi profilini gorebilir"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Kullanici kendi profilini guncelleyebilir"
  on public.profiles for update
  using (auth.uid() = id);

create policy "Kullanici kendi verisini yonetebilir"
  on public.user_workspace for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);
