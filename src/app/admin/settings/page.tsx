import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { SettingsEditor } from "@/components/admin/settings-editor";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminSettingsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Settings</h1>
          <p className="mt-2 text-sm text-ink/60">
            Announcement, contact, Instagram, currency, and Cash on Delivery.
          </p>
        </div>
        <SettingsEditor initial={readStore().siteConfig} />
      </div>
    </AdminShell>
  );
}
