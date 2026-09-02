create extension if not exists "pgcrypto";

create table if not exists public.applications (
  id uuid primary key default gen_random_uuid(),
  opportunity_id text not null,
  candidate_id text not null,
  status text not null check (status in ('draft', 'ready', 'submitted')),
  motivation text not null default '',
  evidence jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now(),
  submitted_at timestamptz
);

alter table public.applications enable row level security;

-- Hackathon demo policy: synthetic records only. Replace with authenticated
-- user ownership policies before storing real applicant data.
create policy "demo applications are readable"
on public.applications for select to anon using (true);

create policy "demo applications are insertable"
on public.applications for insert to anon with check (candidate_id = 'candidate-demo');

create policy "demo applications are updateable"
on public.applications for update to anon
using (candidate_id = 'candidate-demo')
with check (candidate_id = 'candidate-demo');
