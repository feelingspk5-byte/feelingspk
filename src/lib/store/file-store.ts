import { existsSync, mkdirSync, readFileSync, renameSync, writeFileSync } from "fs";
import path from "path";
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

function parseStore(raw: string): StoreState {
  const parsed = JSON.parse(raw) as StoreState;
  if (!parsed || parsed.version !== 1) {
    throw new Error("Invalid store version");
  }
  return parsed;
}

export function getStorePath() {
  return STORE_PATH;
}

export function readStore(): StoreState {
  if (memory) return memory;

  ensureDir();
  if (!existsSync(STORE_PATH)) {
    memory = createSeedStore();
    writeFileSync(STORE_PATH, JSON.stringify(memory, null, 2), "utf8");
    return memory;
  }

  try {
    memory = parseStore(readFileSync(STORE_PATH, "utf8"));
    return memory;
  } catch {
    memory = createSeedStore();
    writeFileSync(STORE_PATH, JSON.stringify(memory, null, 2), "utf8");
    return memory;
  }
}

export async function updateStore(
  mutator: (draft: StoreState) => void,
): Promise<StoreState> {
  writeChain = writeChain.then(() => {
    const current = structuredClone(readStore());
    mutator(current);
    current.updatedAt = new Date().toISOString();
    ensureDir();
    writeFileSync(TMP_PATH, JSON.stringify(current, null, 2), "utf8");
    renameSync(TMP_PATH, STORE_PATH);
    memory = current;
  });
  await writeChain;
  return readStore();
}

export function resetStoreMemory() {
  memory = null;
}
