import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { ReturnsManager } from "@/components/admin/returns-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminReturnsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const store = readStore();

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Returns</h1>
          <p className="mt-2 text-sm text-ink/60">
            Log and track return / exchange requests against COD orders.
          </p>
        </div>
        <ReturnsManager initial={store.returns} orders={store.orders} />
      </div>
    </AdminShell>
  );
}
