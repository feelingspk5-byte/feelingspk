import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { OrdersTable } from "@/components/admin/orders-table";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminOrdersPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const orders = [...readStore().orders].sort((a, b) =>
    b.createdAt.localeCompare(a.createdAt),
  );

  return (
    <AdminShell email={session.email}>
      <div className="space-y-6">
        <div>
          <h1 className="font-display text-3xl tracking-tight">COD orders</h1>
          <p className="mt-2 text-sm text-ink/60">
            Cash on Delivery requests from checkout. Confirm on WhatsApp, then
            move through packing and delivery.
          </p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </AdminShell>
  );
}
