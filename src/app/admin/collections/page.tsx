import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CollectionsManager } from "@/components/admin/collections-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminCollectionsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Collections</h1>
          <p className="mt-2 text-sm text-ink/60">
            Group products into merchandising lines shown on the storefront.
          </p>
        </div>
        <CollectionsManager initial={readStore().collections} />
      </div>
    </AdminShell>
  );
}
