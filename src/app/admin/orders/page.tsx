import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatPrice } from "@/lib/catalog";
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
          <h1 className="font-display text-3xl tracking-tight">
            COD orders
          </h1>
          <p className="mt-2 text-sm text-ink/60">
            Cash on Delivery requests from checkout. Confirm on WhatsApp, then
            move through packing and delivery.
          </p>
        </div>

        {orders.length === 0 ? (
          <p className="border border-ink/10 bg-ivory p-8 text-sm text-ink/55">
            No orders yet.
          </p>
        ) : (
          <div className="overflow-x-auto border border-ink/10 bg-ivory">
            <table className="w-full min-w-[720px] text-left text-sm">
              <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
                <tr>
                  <th className="px-4 py-3 font-medium">Customer</th>
                  <th className="px-4 py-3 font-medium">City</th>
                  <th className="px-4 py-3 font-medium">Status</th>
                  <th className="px-4 py-3 font-medium">Total</th>
                  <th className="px-4 py-3 font-medium">Placed</th>
                  <th className="px-4 py-3 font-medium" />
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o.id} className="border-b border-ink/10 last:border-0">
                    <td className="px-4 py-3">
                      <p className="font-medium">{o.customer.name}</p>
                      <p className="text-xs text-ink/45">{o.customer.phone}</p>
                    </td>
                    <td className="px-4 py-3 text-ink/70">{o.delivery.city}</td>
                    <td className="px-4 py-3 capitalize text-ink/70">
                      {o.status}
                    </td>
                    <td className="px-4 py-3 text-ink/70">
                      {o.subtotal === undefined
                        ? "On request"
                        : formatPrice(o.subtotal, o.currency)}
                    </td>
                    <td className="px-4 py-3 text-ink/55">
                      {new Date(o.createdAt).toLocaleString("en-PK")}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/orders/${o.id}`}
                        className="text-wine hover:underline"
                      >
                        Open
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminShell>
  );
}
