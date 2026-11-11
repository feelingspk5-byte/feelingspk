const KEY = "feelings-admin-recent-v1";

export type RecentItem = {
  id: string;
  type: string;
  title: string;
  subtitle?: string;
  href: string;
  at: number;
};

export function readRecent(): RecentItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return [];
    return (JSON.parse(raw) as RecentItem[]).slice(0, 12);
  } catch {
    return [];
  }
}

export function pushRecent(item: Omit<RecentItem, "at">) {
  if (typeof window === "undefined") return;
  const next = [
    { ...item, at: Date.now() },
    ...readRecent().filter((r) => !(r.type === item.type && r.id === item.id)),
  ].slice(0, 12);
  localStorage.setItem(KEY, JSON.stringify(next));
}
