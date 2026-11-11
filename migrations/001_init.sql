-- FEELINGS admin Phase 1 schema (for Cursor-hosted Postgres).
-- Local/dev currently uses data/runtime-store.json; this migration
-- prepares the hosted database for a later Postgres-backed store.

CREATE TABLE IF NOT EXISTS admin_meta (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  password_hash TEXT,
  created_at TIMESTAMPTZ
);

CREATE TABLE IF NOT EXISTS site_config (
  id INTEGER PRIMARY KEY CHECK (id = 1),
  data JSONB NOT NULL
);

CREATE TABLE IF NOT EXISTS collections (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  sort_order INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS products (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  data JSONB NOT NULL,
  availability TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS media_assets (
  id TEXT PRIMARY KEY,
  src TEXT NOT NULL,
  alt TEXT,
  kind TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY,
  status TEXT NOT NULL,
  data JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS orders_created_at_idx ON orders (created_at DESC);
CREATE INDEX IF NOT EXISTS products_availability_idx ON products (availability);
