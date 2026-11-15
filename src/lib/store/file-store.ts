import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { migrateStore } from "@/lib/store/migrate";
import { createSeedStore } from "@/lib/store/seed";
import type { StoreState } from "@/lib/store/types";

/**
 * On Vercel the deploy filesystem is read-only. Persist under /tmp so
 * catalogue / CMS / COD still work (ephemeral across cold starts).
 * Locally keep data/runtime-store.json as before.
 */
const DATA_DIR = process.env.VERCEL
  ? path.join("/tmp", "feelings-data")
  : path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "runtime-store.json");
const TMP_PATH = path.join(DATA_DIR, "runtime-store.tmp.json");

let memory: StoreState | null = null;
let writeChain: Promise<void> = Promise.resolve();
let writable: boolean | null = null;

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function canPersist(): boolean {
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

function persist(store: StoreState) {
  memory = store;
  if (!canPersist()) return;
  try {
    ensureDir();
    writeFileSync(TMP_PATH, JSON.stringify(store, null, 2), "utf8");
    renameSync(TMP_PATH, STORE_PATH);
  } catch {
    writable = false;
  }
}

export function getStorePath() {
  return STORE_PATH;
}

export function readStore(): StoreState {
  if (memory) return memory;

  try {
    if (existsSync(STORE_PATH)) {
      const raw = JSON.parse(readFileSync(STORE_PATH, "utf8"));
      const migrated = migrateStore(raw);
      memory = migrated;
      if (raw.version !== 2) {
        persist(migrated);
      }
      return migrated;
    }
  } catch {
    /* fall through to seed */
  }

  // Optional read-only seed committed with the app (local data/ is gitignored).
  try {
    const bundled = path.join(process.cwd(), "data", "seed-store.json");
    if (existsSync(bundled)) {
      const raw = JSON.parse(readFileSync(bundled, "utf8"));
      const migrated = migrateStore(raw);
      persist(migrated);
      return migrated;
    }
  } catch {
    /* ignore */
  }

  const seeded = createSeedStore();
  persist(seeded);
  return seeded;
}

export async function updateStore(
  mutator: (draft: StoreState) => void,
): Promise<StoreState> {
  writeChain = writeChain.then(() => {
    const current = structuredClone(readStore());
    mutator(current);
    current.updatedAt = new Date().toISOString();
    persist(current);
  });
  await writeChain;
  return readStore();
}

export function resetStoreMemory() {
  memory = null;
}
