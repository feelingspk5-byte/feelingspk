import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CustomersManager } from "@/components/admin/customers-manager";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminCustomersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const customers = [...readStore().customers].sort((a, b) =>
    b.updatedAt.localeCompare(a.updatedAt),
  );

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Customers</h1>
          <p className="mt-2 text-sm text-ink/60">
            Buyers from COD checkout — tags, spend, WhatsApp.
          </p>
        </div>
        <CustomersManager initial={customers} />
      </div>
    </AdminShell>
  );
}
