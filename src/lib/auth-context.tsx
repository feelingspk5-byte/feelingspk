"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const USERS_KEY = "feelings-users-v1";
const SESSION_KEY = "feelings-session-v1";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

interface StoredUser extends AuthUser {
  password: string;
}

interface AuthContextValue {
  user: AuthUser | null;
  ready: boolean;
  signIn: (email: string, password: string) => { ok: true } | { ok: false; error: string };
  signUp: (
    name: string,
    email: string,
    password: string,
  ) => { ok: true } | { ok: false; error: string };
  signOut: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

function readUsers(): StoredUser[] {
  try {
    const raw = localStorage.getItem(USERS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as StoredUser[];
  } catch {
    return [];
  }
}

function writeUsers(users: StoredUser[]) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function toPublic(user: StoredUser): AuthUser {
  return { id: user.id, name: user.name, email: user.email };
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const session = localStorage.getItem(SESSION_KEY);
      if (session) {
        const email = JSON.parse(session) as string;
        const found = readUsers().find(
          (u) => u.email.toLowerCase() === email.toLowerCase(),
        );
        if (found) setUser(toPublic(found));
      }
    } catch {
      /* ignore */
    }
    setReady(true);
  }, []);

  const signIn = useCallback((email: string, password: string) => {
    const normalized = email.trim().toLowerCase();
    if (!normalized || !password) {
      return { ok: false as const, error: "Enter your email and password." };
    }
    const found = readUsers().find((u) => u.email.toLowerCase() === normalized);
    if (!found || found.password !== password) {
      return { ok: false as const, error: "Email or password is incorrect." };
    }
    localStorage.setItem(SESSION_KEY, JSON.stringify(found.email));
    setUser(toPublic(found));
    return { ok: true as const };
  }, []);

  const signUp = useCallback(
    (name: string, email: string, password: string) => {
      const trimmedName = name.trim();
      const normalized = email.trim().toLowerCase();
      if (!trimmedName || !normalized || password.length < 6) {
        return {
          ok: false as const,
          error: "Name, email, and a password of at least 6 characters are required.",
        };
      }
      const users = readUsers();
      if (users.some((u) => u.email.toLowerCase() === normalized)) {
        return {
          ok: false as const,
          error: "An account with this email already exists. Sign in instead.",
        };
      }
      const created: StoredUser = {
        id: `user-${Date.now()}`,
        name: trimmedName,
        email: normalized,
        password,
      };
      writeUsers([...users, created]);
      localStorage.setItem(SESSION_KEY, JSON.stringify(created.email));
      setUser(toPublic(created));
      return { ok: true as const };
    },
    [],
  );

  const signOut = useCallback(() => {
    localStorage.removeItem(SESSION_KEY);
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({ user, ready, signIn, signUp, signOut }),
    [user, ready, signIn, signUp, signOut],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
