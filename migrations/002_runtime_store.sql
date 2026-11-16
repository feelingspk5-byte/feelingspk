-- FEELINGS durable catalogue / admin store (single JSON document).
-- Run this in the Supabase SQL editor once.

create table if not exists public.runtime_store (
  id text primary key default 'default',
  data jsonb not null,
  updated_at timestamptz not null default now()
);

alter table public.runtime_store enable row level security;

-- Service role bypasses RLS; no public policies on purpose.
comment on table public.runtime_store is
  'FEELINGS admin catalogue snapshot — read/write only via service role.';
