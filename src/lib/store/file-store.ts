import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { migrateStore } from "@/lib/store/migrate";
import { createSeedStore } from "@/lib/store/seed";
import type { StoreState } from "@/lib/store/types";

/**
 * Catalogue / CMS / COD store.
 *
 * - Local: `data/runtime-store.json`
 * - Production (preferred): Supabase `runtime_store` table when
 *   `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` are set
 * - Production (alt): Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set
 * - Vercel with neither: `/tmp` fallback (ephemeral — prices will not stick)
 */
const BLOB_PATH = "feelings/runtime-store.json";
const SUPABASE_ROW_ID = "default";
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "feelings-data")
  : path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "runtime-store.json");
const TMP_PATH = path.join(DATA_DIR, "runtime-store.tmp.json");

let memory: StoreState | null = null;
let loadPromise: Promise<StoreState> | null = null;
let writeChain: Promise<void> = Promise.resolve();
let writable: boolean | null = null;

function isBuildPhase() {
  return process.env.NEXT_PHASE === "phase-production-build";
}

function hasSupabaseBackend() {
  if (isBuildPhase()) return false;
  return Boolean(
    process.env.SUPABASE_URL?.trim() &&
      process.env.SUPABASE_SERVICE_ROLE_KEY?.trim(),
  );
}

function hasBlobBackend() {
  if (isBuildPhase()) return false;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

function hasRemoteBackend() {
  return hasSupabaseBackend() || hasBlobBackend();
}

export function getStoreBackend():
  | "supabase"
  | "blob"
  | "file"
  | "ephemeral" {
  if (hasSupabaseBackend()) return "supabase";
  if (hasBlobBackend()) return "blob";
  if (process.env.VERCEL) return "ephemeral";
  return "file";
}

export function getStorePath() {
  if (hasSupabaseBackend()) return "supabase:runtime_store";
  if (hasBlobBackend()) return `blob:${BLOB_PATH}`;
  return STORE_PATH;
}

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function canPersistFile(): boolean {
  if (writable !== null) return writable;
  try {
    ensureDir();
    const probe = path.join(DATA_DIR, ".write-probe");
    writeFileSync(probe, "ok", "utf8");
    writable = true;
    return true;
  } catch {
    writable = false;
    return false;
  }
}

function seedStore(): StoreState {
  try {
    const bundled = path.join(process.cwd(), "data", "seed-store.json");
    if (existsSync(bundled)) {
      return migrateStore(JSON.parse(readFileSync(bundled, "utf8")));
    }
  } catch {
    /* ignore */
  }
  return createSeedStore();
}

function readFromDisk(): StoreState | null {
  try {
    if (!existsSync(STORE_PATH)) return null;
    return migrateStore(JSON.parse(readFileSync(STORE_PATH, "utf8")));
  } catch {
    return null;
  }
}

function writeToDisk(store: StoreState) {
  if (!canPersistFile()) return;
  try {
    ensureDir();
    writeFileSync(TMP_PATH, JSON.stringify(store, null, 2), "utf8");
    renameSync(TMP_PATH, STORE_PATH);
  } catch {
    writable = false;
  }
}

async function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL!.trim();
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY!.trim();
  const { createClient } = await import("@supabase/supabase-js");
  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function readFromSupabase(): Promise<StoreState | null> {
  try {
    const supabase = await getSupabaseAdmin();
    const { data, error } = await supabase
      .from("runtime_store")
      .select("data")
      .eq("id", SUPABASE_ROW_ID)
      .maybeSingle();
    if (error) {
      console.error("[store] supabase read failed", error.message);
      return null;
    }
    if (!data?.data) return null;
    return migrateStore(data.data);
  } catch (error) {
    console.error("[store] supabase read error", error);
    return null;
  }
}

async function writeToSupabase(store: StoreState) {
  const supabase = await getSupabaseAdmin();
  const { error } = await supabase.from("runtime_store").upsert(
    {
      id: SUPABASE_ROW_ID,
      data: store,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "id" },
  );
  if (error) {
    throw new Error(`Supabase store write failed: ${error.message}`);
  }
}

async function readFromBlob(): Promise<StoreState | null> {
  try {
    const { get } = await import("@vercel/blob");
    const result = await get(BLOB_PATH, {
      access: "private",
      useCache: false,
    });
    if (!result || result.statusCode !== 200 || !result.stream) return null;
    const text = await new Response(result.stream).text();
    if (!text.trim()) return null;
    return migrateStore(JSON.parse(text));
  } catch {
    return null;
  }
}

async function writeToBlob(store: StoreState) {
  const { put } = await import("@vercel/blob");
  await put(BLOB_PATH, JSON.stringify(store), {
    access: "private",
    addRandomSuffix: false,
    allowOverwrite: true,
    contentType: "application/json",
    cacheControlMaxAge: 60,
  });
}

async function loadStore(): Promise<StoreState> {
  if (hasSupabaseBackend()) {
    const fromSupabase = await readFromSupabase();
    if (fromSupabase) {
      memory = fromSupabase;
      return fromSupabase;
    }
    const seeded = seedStore();
    memory = seeded;
    try {
      await writeToSupabase(seeded);
    } catch (error) {
      console.error("[store] supabase seed write failed", error);
    }
    return seeded;
  }

  if (hasBlobBackend()) {
    const fromBlob = await readFromBlob();
    if (fromBlob) {
      memory = fromBlob;
      return fromBlob;
    }
    const seeded = seedStore();
    memory = seeded;
    try {
      await writeToBlob(seeded);
    } catch {
      /* first write may fail if token misconfigured — still serve seed */
    }
    return seeded;
  }

  const fromDisk = readFromDisk();
  if (fromDisk) {
    memory = fromDisk;
    return fromDisk;
  }

  const seeded = seedStore();
  memory = seeded;
  writeToDisk(seeded);
  return seeded;
}

/** Load shared store into memory (call once per request on server entry). */
export async function ensureStore(): Promise<StoreState> {
  // On remote backends, always reload so serverless instances see admin saves.
  if (hasRemoteBackend()) {
    if (!loadPromise) {
      loadPromise = loadStore().finally(() => {
        loadPromise = null;
      });
    }
    return loadPromise;
  }

  if (memory) return memory;
  if (!loadPromise) {
    loadPromise = loadStore().finally(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

export function readStore(): StoreState {
  // File backend: always re-read disk (source of truth across Next bundles).
  if (!hasRemoteBackend()) {
    const fromDisk = readFromDisk();
    if (fromDisk) {
      memory = fromDisk;
      return fromDisk;
    }
    if (memory) return memory;
    const seeded = seedStore();
    memory = seeded;
    writeToDisk(seeded);
    return seeded;
  }

  if (memory) return memory;
  // Remote mode without ensureStore — temporary seed until async load finishes.
  const seeded = seedStore();
  memory = seeded;
  return seeded;
}

export async function updateStore(
  mutator: (draft: StoreState) => void,
): Promise<StoreState> {
  writeChain = writeChain.then(async () => {
    await ensureStore();
    const current = structuredClone(readStore());
    mutator(current);
    current.updatedAt = new Date().toISOString();
    memory = current;
    if (hasSupabaseBackend()) {
      await writeToSupabase(current);
    } else if (hasBlobBackend()) {
      await writeToBlob(current);
    } else {
      writeToDisk(current);
    }
  });
  await writeChain;
  return readStore();
}

export function resetStoreMemory() {
  memory = null;
}
