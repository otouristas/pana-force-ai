-- Intel monitoring schema for opponent updates from news and social sources
create table if not exists public.intel_settings (
  id uuid primary key default gen_random_uuid(),
  team varchar(128) not null,
  keywords text[] not null default '{}',
  sources text[] not null default '{"twitter","news","rss"}',
  trust_scores jsonb not null default '{}',
  polling_interval_seconds integer not null default 600,
  is_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.intel_raw_events (
  id uuid primary key default gen_random_uuid(),
  source varchar(32) not null,
  source_id varchar(256),
  url text,
  title text,
  content text,
  author varchar(256),
  language varchar(8),
  published_at timestamptz,
  fetched_at timestamptz not null default now(),
  team varchar(128),
  opponent varchar(128),
  match_id varchar(128),
  hash varchar(64) unique,
  metadata jsonb not null default '{}'
);

create table if not exists public.intel_events (
  id uuid primary key default gen_random_uuid(),
  raw_event_id uuid references public.intel_raw_events(id) on delete set null,
  event_type varchar(64) not null, -- injury, lineup, travel, disciplinary, weather, other
  confidence numeric not null default 0.5,
  urgency varchar(16) not null default 'low', -- low | medium | high
  entities jsonb not null default '{}', -- { players:[], team:"", ... }
  summary text not null,
  team varchar(128),
  opponent varchar(128),
  match_id varchar(128),
  created_at timestamptz not null default now()
);

create table if not exists public.intel_alerts (
  id uuid primary key default gen_random_uuid(),
  event_id uuid references public.intel_events(id) on delete cascade,
  severity varchar(16) not null default 'info', -- info | warning | critical
  is_acknowledged boolean not null default false,
  created_at timestamptz not null default now()
);

-- helpful indexes
create index if not exists idx_intel_raw_events_hash on public.intel_raw_events(hash);
create index if not exists idx_intel_events_match on public.intel_events(match_id);
create index if not exists idx_intel_events_opponent on public.intel_events(opponent);
create index if not exists idx_intel_alerts_event on public.intel_alerts(event_id);

-- realtime publication for alerts
alter publication supabase_realtime add table public.intel_alerts;


