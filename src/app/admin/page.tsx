import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatPrice } from "@/lib/format";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

const QUICK = [
  { href: "/admin/products/new", label: "Add product" },
  { href: "/admin/offers", label: "Create offer" },
  { href: "/admin/cms", label: "Edit website" },
  { href: "/admin/settings", label: "Store settings" },
  { href: "/admin/orders", label: "COD orders" },
  { href: "/admin/analytics", label: "Analytics" },
];

export default async function AdminHomePage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  const store = readStore();
  const pending = store.orders.filter((o) => o.status === "pending").length;
  const inStock = store.products.filter((p) => p.availability === "in_stock")
    .length;
  const activeOffers = store.offers.filter((o) => o.active).length;
  const drafts = store.products.filter((p) => p.publishStatus === "draft")
    .length;
  const lowStock = store.products.filter((p) => {
    if (p.stockQty === undefined) return false;
    return p.stockQty <= (p.lowStockThreshold ?? 5);
  });
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
            Full control of catalogue, website content, offers, shipping,
            customers, returns, and COD orders — without opening code.
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
              label: "Active offers",
              value: String(activeOffers),
              href: "/admin/offers",
            },
            {
              label: "Low stock",
              value: String(lowStock.length),
              href: "/admin/products",
            },
            {
              label: "Drafts",
              value: String(drafts),
              href: "/admin/products",
            },
            {
              label: "Customers",
              value: String(store.customers.length),
              href: "/admin/customers",
            },
            {
              label: "Returns open",
              value: String(
                store.returns.filter(
                  (r) => r.status !== "refunded" && r.status !== "rejected",
                ).length,
              ),
              href: "/admin/returns",
            },
            {
              label: "Media",
              value: String(store.media.length),
              href: "/admin/media",
            },
            {
              label: "Shipping zones",
              value: String(store.shippingZones.length),
              href: "/admin/shipping",
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

        <div className="flex flex-wrap gap-3">
          {QUICK.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-11 items-center rounded-sm border border-ink px-5 text-sm text-ink hover:bg-ink hover:text-ivory"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {lowStock.length > 0 ? (
          <section className="border border-wine/30 bg-wine/[0.04] p-6">
            <h2 className="font-display text-2xl text-ink">Low-stock alerts</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {lowStock.slice(0, 8).map((p) => (
                <li
                  key={p.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-3 text-sm"
                >
                  <Link
                    href={`/admin/products/${p.id}`}
                    className="font-medium hover:text-wine"
                  >
                    {p.name}
                  </Link>
                  <span className="text-wine">
                    {p.stockQty} left (alert ≤ {p.lowStockThreshold ?? 5})
                  </span>
                </li>
              ))}
            </ul>
          </section>
        ) : null}

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
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 py-4"
                >
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
      </div>
    </AdminShell>
  );
}
