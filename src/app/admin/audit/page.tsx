import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminAuditPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const log = readStore().auditLog;

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Audit log</h1>
          <p className="mt-2 text-sm text-ink/60">
            Recent admin actions — who changed what.
          </p>
        </div>
        <ul className="divide-y divide-ink/10 border border-ink/10 bg-ivory">
          {log.map((entry) => (
            <li key={entry.id} className="px-5 py-4 text-sm">
              <p className="font-medium text-ink">{entry.action}</p>
              <p className="mt-1 text-xs text-ink/50">
                {entry.actor} · {new Date(entry.at).toLocaleString("en-PK")}
                {entry.detail ? ` · ${entry.detail}` : ""}
              </p>
            </li>
          ))}
          {log.length === 0 ? (
            <li className="px-5 py-8 text-ink/55">No audited actions yet.</li>
          ) : null}
        </ul>
      </div>
    </AdminShell>
  );
}
