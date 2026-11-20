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
  updated_at timestamptz default now()
);

alter table public.profiles enable row level security;
alter table public.user_workspace enable row level security;

drop policy if exists "Kullanici kendi profilini gorebilir" on public.profiles;
create policy "Kullanici kendi profilini gorebilir"
  on public.profiles for select using (auth.uid() = id);

drop policy if exists "Kullanici kendi verisini yonetebilir" on public.user_workspace;
create policy "Kullanici kendi verisini yonetebilir"
  on public.user_workspace for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

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
