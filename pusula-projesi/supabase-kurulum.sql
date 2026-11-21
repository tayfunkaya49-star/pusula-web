-- PUSULA — SUPABASE GERÇEK ÜYELİK VE BULUT KAYIT KURULUMU
-- Supabase -> SQL Editor -> New query -> Yapıştır -> Run

create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text,
  is_pro boolean default false,
  created_at timestamptz default now()
);

create table if not exists public.user_workspace (
  user_id uuid references auth.users on delete cascade primary key,
  scratchpad text default '',
  tasks jsonb default '[]'::jsonb,
  habits jsonb default '[]'::jsonb,
  ideas jsonb default '[]'::jsonb,
  subscriptions jsonb default '[]'::jsonb,
  academy_state jsonb default '{}'::jsonb,
  extra_data jsonb default '{}'::jsonb,
  updated_at timestamptz default now()
);

-- Mevcut tablolara güvenli sütun ekleme (geriye dönük uyumluluk)
alter table public.user_workspace add column if not exists academy_state jsonb default '{}'::jsonb;
alter table public.user_workspace add column if not exists extra_data jsonb default '{}'::jsonb;

create table if not exists public.payment_requests (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users on delete set null,
  email text not null,
  sender_name text,
  plan text,
  note text,
  status text default 'bekliyor',
  created_at timestamptz default now()
);

create table if not exists public.project_inquiries (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  topic text,
  details text,
  created_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_workspace enable row level security;
alter table public.payment_requests enable row level security;
alter table public.project_inquiries enable row level security;

drop policy if exists "Kullanici kendi profilini gorebilir" on public.profiles;
create policy "Kullanici kendi profilini gorebilir"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Kullanici kendi verisini yonetebilir" on public.user_workspace;
create policy "Kullanici kendi verisini yonetebilir"
  on public.user_workspace for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "Herkes odeme bildirimi gonderebilir" on public.payment_requests;
create policy "Herkes odeme bildirimi gonderebilir"
  on public.payment_requests for insert with check (true);

drop policy if exists "Kullanici kendi odeme bildirimini gorebilir" on public.payment_requests;
create policy "Kullanici kendi odeme bildirimini gorebilir"
  on public.payment_requests for select using (auth.uid() = user_id);

drop policy if exists "Herkes proje teklifi gonderebilir" on public.project_inquiries;
create policy "Herkes proje teklifi gonderebilir"
  on public.project_inquiries for insert with check (true);

-- Yeni üye kaydolduğunda profilini otomatik oluşturur
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do nothing;
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
