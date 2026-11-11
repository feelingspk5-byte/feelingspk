import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
import { migrateStore } from "@/lib/store/migrate";
import { createSeedStore } from "@/lib/store/seed";
import type { StoreState } from "@/lib/store/types";

const DATA_DIR = path.join(process.cwd(), "data");
const STORE_PATH = path.join(DATA_DIR, "runtime-store.json");
const TMP_PATH = path.join(DATA_DIR, "runtime-store.tmp.json");

let memory: StoreState | null = null;
let writeChain: Promise<void> = Promise.resolve();

function ensureDir() {
  if (!existsSync(DATA_DIR)) {
    mkdirSync(DATA_DIR, { recursive: true });
  }
}

function persist(store: StoreState) {
  ensureDir();
  writeFileSync(TMP_PATH, JSON.stringify(store, null, 2), "utf8");
  renameSync(TMP_PATH, STORE_PATH);
  memory = store;
}

export function getStorePath() {
  return STORE_PATH;
}

export function readStore(): StoreState {
  if (memory) return memory;

  ensureDir();
  if (!existsSync(STORE_PATH)) {
    const seeded = createSeedStore();
    persist(seeded);
    return seeded;
  }

  try {
    const raw = JSON.parse(readFileSync(STORE_PATH, "utf8"));
    const migrated = migrateStore(raw);
    if (raw.version !== 2) {
      persist(migrated);
    } else {
      memory = migrated;
    }
    return migrated;
  } catch {
    const seeded = createSeedStore();
    persist(seeded);
    return seeded;
  }
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
