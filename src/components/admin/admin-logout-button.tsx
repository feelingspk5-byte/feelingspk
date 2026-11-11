"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function AdminLogoutButton() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);

  async function logout() {
    setBusy(true);
    await fetch("/api/admin/logout", { method: "POST" });
    router.push("/admin/login");
    router.refresh();
  }

  return (
    <button
      type="button"
      onClick={logout}
      disabled={busy}
      className="rounded-sm border border-ink/20 px-3 py-1.5 text-sm text-ink/70 transition-colors hover:border-ink hover:text-ink disabled:opacity-50"
    >
      {busy ? "…" : "Sign out"}
    </button>
  );
}
