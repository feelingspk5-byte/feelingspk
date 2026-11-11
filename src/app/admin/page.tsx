import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";
import { formatPrice } from "@/lib/catalog";

export default async function AdminHomePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const store = readStore();
  const pending = store.orders.filter((o) => o.status === "pending").length;
  const inStock = store.products.filter((p) => p.availability === "in_stock")
    .length;
  const recent = [...store.orders]
    .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
    .slice(0, 5);

  return (
    <AdminShell email={session.email}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight md:text-4xl">
            Overview
          </h1>
          <p className="mt-2 max-w-2xl text-sm text-ink/60">
            Manage inventory, media, and Cash on Delivery orders. Changes here
            update the live storefront.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              label: "Products",
              value: String(store.products.length),
              href: "/admin/products",
            },
            {
              label: "In stock",
              value: String(inStock),
              href: "/admin/products",
            },
            {
              label: "Pending COD",
              value: String(pending),
              href: "/admin/orders",
            },
            {
              label: "Media assets",
              value: String(store.media.length),
              href: "/admin/media",
            },
          ].map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className="border border-ink/10 bg-ivory p-5 transition-colors hover:border-wine/40"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">
                {card.label}
              </p>
              <p className="mt-3 font-display text-3xl text-ink">{card.value}</p>
            </Link>
          ))}
        </div>

        <section className="border border-ink/10 bg-ivory p-6">
          <div className="flex items-baseline justify-between gap-4">
            <h2 className="font-display text-2xl">Recent COD orders</h2>
            <Link
              href="/admin/orders"
              className="text-sm text-ink/55 hover:text-wine"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-ink/55">
              No orders yet. When customers place a COD request, it appears here.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-ink/10">
              {recent.map((order) => (
                <li key={order.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-ink hover:text-wine"
                    >
                      {order.customer.name}
                    </Link>
                    <p className="text-xs text-ink/50">
                      {order.status} · {order.lines.length} item
                      {order.lines.length === 1 ? "" : "s"} ·{" "}
                      {new Date(order.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>
                  <p className="text-sm text-ink">
                    {order.subtotal === undefined
                      ? "On request"
                      : formatPrice(order.subtotal, order.currency)}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </section>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/products/new"
            className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm text-ivory"
          >
            Add product
          </Link>
          <Link
            href="/admin/media"
            className="inline-flex h-11 items-center rounded-sm border border-ink px-5 text-sm text-ink"
          >
            Upload media
          </Link>
        </div>
      </div>
    </AdminShell>
  );
}
