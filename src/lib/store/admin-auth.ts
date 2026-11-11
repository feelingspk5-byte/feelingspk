import { createHmac, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";
import bcrypt from "bcryptjs";
import { readStore, updateStore } from "@/lib/store/file-store";

const COOKIE = "feelings_admin_session";
const MAX_AGE_SEC = 60 * 60 * 12; // 12 hours

function sessionSecret(): string {
  const fromEnv = process.env.ADMIN_SESSION_SECRET;
  if (fromEnv && fromEnv.length >= 16) return fromEnv;
  // Local/dev only fallback — published apps should set ADMIN_SESSION_SECRET
  return "feelings-local-admin-session";
}

function sign(payload: string): string {
  return createHmac("sha256", sessionSecret()).update(payload).digest("hex");
}

function encodeSession(email: string, exp: number): string {
  const body = Buffer.from(JSON.stringify({ email, exp }), "utf8").toString(
    "base64url",
  );
  return `${body}.${sign(body)}`;
}

function decodeSession(
  token: string | undefined,
): { email: string; exp: number } | null {
  if (!token) return null;
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    const a = Buffer.from(sig);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(
      Buffer.from(body, "base64url").toString("utf8"),
    ) as { email: string; exp: number };
    if (!parsed.email || !parsed.exp || parsed.exp < Date.now()) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function adminIsConfigured(): boolean {
  return Boolean(readStore().admin.passwordHash);
}

export async function setAdminPassword(password: string): Promise<void> {
  if (password.trim().length < 8) {
    throw new Error("Password must be at least 8 characters.");
  }
  const passwordHash = await bcrypt.hash(password, 10);
  await updateStore((draft) => {
    draft.admin.passwordHash = passwordHash;
    draft.admin.createdAt = new Date().toISOString();
  });
}

export async function verifyAdminPassword(password: string): Promise<boolean> {
  const hash = readStore().admin.passwordHash;
  if (!hash) return false;
  return bcrypt.compare(password, hash);
}

export async function createAdminSession(email = "admin@feelings"): Promise<void> {
  const exp = Date.now() + MAX_AGE_SEC * 1000;
  const jar = await cookies();
  jar.set(COOKIE, encodeSession(email, exp), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearAdminSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getAdminSession(): Promise<{ email: string } | null> {
  const jar = await cookies();
  const parsed = decodeSession(jar.get(COOKIE)?.value);
  if (!parsed) return null;
  return { email: parsed.email };
}

export async function requireAdminSession(): Promise<{ email: string }> {
  const session = await getAdminSession();
  if (!session) {
    throw new Error("Unauthorized");
  }
  return session;
}
