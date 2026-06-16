create extension if not exists "pgcrypto";

create table if not exists public.notice_categories (
  id text primary key,
  name text not null,
  color text not null default '#475467',
  sort_order integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.game_titles (
  id text primary key,
  name text not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

insert into public.game_titles (id, name)
values
  ('stella-quest', 'Stella Quest'),
  ('pixel-arena', 'Pixel Arena'),
  ('dragon-frontier', 'Dragon Frontier')
on conflict (id) do update set
  name = excluded.name,
  updated_at = now();

insert into public.notice_categories (id, name, color, sort_order)
values
  ('important', U&'\91cd\8981', '#e11d48', 1),
  ('maintenance', U&'\30e1\30f3\30c6\30ca\30f3\30b9', '#2563eb', 2),
  ('event', U&'\30a4\30d9\30f3\30c8', '#059669', 3),
  ('campaign', U&'\30ad\30e3\30f3\30da\30fc\30f3', '#d97706', 4),
  ('update', U&'\30a2\30c3\30d7\30c7\30fc\30c8', '#7c3aed', 5),
  ('bug', U&'\4e0d\5177\5408', '#be123c', 6),
  ('other', U&'\305d\306e\4ed6', '#475467', 7)
on conflict (id) do update set
  name = excluded.name,
  color = excluded.color,
  sort_order = excluded.sort_order,
  updated_at = now();

create table if not exists public.notice_templates (
  category_id text primary key references public.notice_categories(id) on delete cascade,
  title text not null default '',
  body text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.notices (
  id uuid primary key default gen_random_uuid(),
  game_id text not null default 'stella-quest' references public.game_titles(id),
  category_id text not null references public.notice_categories(id),
  title text not null,
  body text not null,
  banner_image text,
  status text not null default 'draft' check (status in ('draft', 'published', 'hidden')),
  is_pinned boolean not null default false,
  publish_at timestamptz not null,
  new_badge_start_at timestamptz,
  new_badge_end_at timestamptz,
  sort_order integer not null default 50,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.notices
  add column if not exists game_id text not null default 'stella-quest';

alter table public.notices
  drop constraint if exists notices_game_id_fkey;

alter table public.notices
  add constraint notices_game_id_fkey foreign key (game_id) references public.game_titles(id);

alter table public.notices
  add column if not exists new_badge_start_at timestamptz;

alter table public.notices
  add column if not exists new_badge_end_at timestamptz;

create index if not exists notices_public_index
  on public.notices (game_id, status, publish_at desc, is_pinned desc, sort_order asc);

create unique index if not exists notices_one_pinned_per_game
  on public.notices (game_id)
  where is_pinned = true;

insert into storage.buckets (id, name, public)
values ('notice-banners', 'notice-banners', true)
on conflict (id) do update set public = true;

alter table public.notice_categories enable row level security;
alter table public.game_titles enable row level security;
alter table public.notice_templates enable row level security;
alter table public.notices enable row level security;

create policy "Public categories are readable"
  on public.notice_categories
  for select
  using (true);

create policy "Public game titles are readable"
  on public.game_titles
  for select
  using (true);

create policy "Published notices are readable"
  on public.notices
  for select
  using (status = 'published' and publish_at <= now());

create policy "Notice banners are publicly readable"
  on storage.objects
  for select
  using (bucket_id = 'notice-banners');
