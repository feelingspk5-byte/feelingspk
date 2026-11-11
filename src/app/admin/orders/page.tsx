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
          <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
            Operations
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            COD orders
          </h1>
          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-ink/60">
            Call the client from the list to confirm, then move the order through
            packing and delivery. WhatsApp is one tap away if they miss the call.
          </p>
        </div>
        <OrdersTable orders={orders} />
      </div>
    </AdminShell>
  );
}
