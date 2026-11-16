import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { migrateStore } from "@/lib/store/migrate";
import { createSeedStore } from "@/lib/store/seed";
import type { StoreState } from "@/lib/store/types";

/**
 * Catalogue / CMS / COD store.
 *
 * - Local: `data/runtime-store.json`
 * - Production: private Vercel Blob when `BLOB_READ_WRITE_TOKEN` is set
 *   (shared across all serverless instances — admin edits reach the shop)
 * - Vercel without Blob token: `/tmp` fallback (ephemeral — not for live control)
 */
const BLOB_PATH = "feelings/runtime-store.json";
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

function hasBlobBackend() {
  // Skip Blob during `next build` — use seed/disk so installs stay offline-safe.
  if (isBuildPhase()) return false;
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}

export function getStoreBackend(): "blob" | "file" | "ephemeral" {
  if (hasBlobBackend()) return "blob";
  if (process.env.VERCEL) return "ephemeral";
  return "file";
}

export function getStorePath() {
  return hasBlobBackend() ? `blob:${BLOB_PATH}` : STORE_PATH;
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
    // Minimum allowed by Blob; reads use useCache: false for freshness.
    cacheControlMaxAge: 60,
  });
}

async function loadStore(): Promise<StoreState> {
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
  if (memory) return memory;
  if (!loadPromise) {
    loadPromise = loadStore().finally(() => {
      loadPromise = null;
    });
  }
  return loadPromise;
}

export function readStore(): StoreState {
  if (memory) return memory;
  // Sync path for local/file when ensureStore has not run yet.
  if (!hasBlobBackend()) {
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
  // Blob mode without ensureStore — temporary seed until async load finishes.
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
    if (hasBlobBackend()) {
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
