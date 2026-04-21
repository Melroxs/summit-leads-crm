create extension if not exists "pgcrypto";

create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  subscription_plan text not null default 'starter',
  created_at timestamptz not null default now()
);

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  company_id uuid not null references companies(id) on delete cascade,
  full_name text not null,
  email text not null unique,
  role text not null check (role in ('admin', 'supervisor', 'agent')),
  created_at timestamptz not null default now()
);

create table if not exists campaigns (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  name text not null,
  type text not null check (type in ('solar', 'roofing', 'custom')),
  region text not null,
  dialer_mode text not null check (dialer_mode in ('power', 'predictive')),
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists campaign_documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  name text not null,
  category text not null check (category in ('script', 'company_info', 'rebuttal', 'offer', 'qa')),
  url text not null,
  created_at timestamptz not null default now()
);

create table if not exists campaign_numbers (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  label text not null,
  phone_number text not null,
  region text not null,
  health_score integer not null default 100,
  spam_risk_score integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  full_name text not null,
  phone_number text not null,
  state text not null,
  postal_code text not null,
  assigned_agent_id uuid null references profiles(id) on delete set null,
  last_disposition text not null default 'new',
  attempts integer not null default 0,
  next_dial_at timestamptz null,
  position integer not null,
  created_at timestamptz not null default now()
);

create table if not exists recordings (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  call_id text not null,
  type text not null check (type in ('real_call', 'training')),
  campaign_id uuid not null references campaigns(id) on delete cascade,
  agent_id uuid not null references profiles(id) on delete cascade,
  lead_id uuid null references leads(id) on delete set null,
  duration_seconds integer not null default 0,
  stream_url text not null,
  download_url text not null,
  created_at timestamptz not null default now()
);

create table if not exists call_scores (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  call_id text not null,
  agent_id uuid not null references profiles(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  opening_score integer not null,
  compliance_score integer not null,
  rebuttal_score integer not null,
  close_score integer not null,
  notes text[] not null default '{}',
  created_at timestamptz not null default now()
);

create table if not exists training_scenarios (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  campaign_id uuid not null references campaigns(id) on delete cascade,
  name text not null,
  voice_only boolean not null default true,
  persona text not null,
  objective text not null,
  rebuttal_focus text[] not null default '{}',
  live_coaching_enabled boolean not null default true,
  recording_enabled boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists telephony_accounts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references companies(id) on delete cascade,
  provider text not null check (provider in ('telnyx', 'twilio', 'sip')),
  label text not null,
  active boolean not null default false,
  created_at timestamptz not null default now()
);

alter table companies enable row level security;
alter table profiles enable row level security;
alter table campaigns enable row level security;
alter table campaign_documents enable row level security;
alter table campaign_numbers enable row level security;
alter table leads enable row level security;
alter table recordings enable row level security;
alter table call_scores enable row level security;
alter table training_scenarios enable row level security;
alter table telephony_accounts enable row level security;

create policy "company members can read companies"
on companies for select
using (
  exists (
    select 1 from profiles
    where profiles.company_id = companies.id
    and profiles.id = auth.uid()
  )
);

create policy "company scoped profiles"
on profiles for select
using (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped campaigns"
on campaigns for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped campaign documents"
on campaign_documents for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped campaign numbers"
on campaign_numbers for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped leads"
on leads for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped recordings"
on recordings for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped call scores"
on call_scores for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped training scenarios"
on training_scenarios for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

create policy "company scoped telephony accounts"
on telephony_accounts for all
using (company_id in (select company_id from profiles where id = auth.uid()))
with check (company_id in (select company_id from profiles where id = auth.uid()));

