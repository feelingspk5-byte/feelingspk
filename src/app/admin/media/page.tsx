import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { MediaManager } from "@/components/admin/media-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminMediaPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Media</h1>
          <p className="mt-2 text-sm text-ink/60">
            Upload product photos, then paste the path into a product&apos;s
            primary image field.
          </p>
        </div>
        <MediaManager initial={readStore().media} />
      </div>
    </AdminShell>
  );
}
