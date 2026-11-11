import Link from "next/link";
import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { CallClientActions } from "@/components/admin/call-client-button";
import { formatPrice } from "@/lib/format";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

const QUICK = [
  { href: "/admin/orders", label: "COD orders" },
  { href: "/admin/products/new", label: "Add product" },
  { href: "/admin/offers", label: "Create offer" },
  { href: "/admin/cms", label: "Edit website" },
  { href: "/admin/settings", label: "Store settings" },
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

  const cards = [
    {
      label: "Pending COD",
      value: String(pending),
      href: "/admin/orders",
      emphasize: pending > 0,
    },
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
      label: "Customers",
      value: String(store.customers.length),
      href: "/admin/customers",
    },
    {
      label: "Low stock",
      value: String(lowStock.length),
      href: "/admin/products",
      emphasize: lowStock.length > 0,
    },
    {
      label: "Drafts",
      value: String(drafts),
      href: "/admin/products",
    },
    {
      label: "Active offers",
      value: String(activeOffers),
      href: "/admin/offers",
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
  ];

  return (
    <AdminShell email={session.email}>
      <div className="space-y-8">
        <div className="flex flex-col gap-4 border-b border-ink/10 pb-6 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
              Today&apos;s desk
            </p>
            <h1 className="mt-2 font-display text-3xl tracking-tight md:text-4xl">
              Overview
            </h1>
            <p className="mt-2 max-w-xl text-sm leading-relaxed text-ink/60">
              Confirm COD orders by phone, keep catalogue sharp, and move work
              without leaving this desk.
            </p>
          </div>
          <Link
            href="/admin/orders"
            className="inline-flex h-11 shrink-0 items-center justify-center rounded-sm bg-ink px-5 text-sm text-ivory transition-colors hover:bg-wine"
          >
            Open orders
          </Link>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {cards.map((card) => (
            <Link
              key={card.label}
              href={card.href}
              className={[
                "group rounded-sm border p-5 transition-all",
                card.emphasize
                  ? "border-wine/25 bg-wine/[0.05] hover:border-wine/45"
                  : "border-ink/10 bg-ivory hover:border-ink/25 hover:shadow-[0_8px_24px_rgba(23,23,23,0.04)]",
              ].join(" ")}
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">
                {card.label}
              </p>
              <p className="mt-3 font-display text-3xl tracking-tight text-ink transition-colors group-hover:text-wine">
                {card.value}
              </p>
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2">
          {QUICK.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="inline-flex h-10 items-center rounded-sm border border-ink/15 bg-ivory px-4 text-sm text-ink/75 transition-colors hover:border-ink hover:text-ink"
            >
              {item.label}
            </Link>
          ))}
        </div>

        {lowStock.length > 0 ? (
          <section className="rounded-sm border border-wine/25 bg-wine/[0.04] p-6">
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

        <section className="rounded-sm border border-ink/10 bg-ivory p-6 shadow-[0_1px_0_rgba(23,23,23,0.03)]">
          <div className="flex items-baseline justify-between gap-4">
            <div>
              <p className="text-[11px] uppercase tracking-[0.16em] text-wine">
                Priority
              </p>
              <h2 className="mt-1 font-display text-2xl">Recent COD orders</h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-sm text-ink/55 transition-colors hover:text-wine"
            >
              View all
            </Link>
          </div>
          {recent.length === 0 ? (
            <p className="mt-6 text-sm text-ink/55">
              No orders yet. New COD checkouts appear here for confirmation.
            </p>
          ) : (
            <ul className="mt-6 divide-y divide-ink/8">
              {recent.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-4 py-4"
                >
                  <div className="min-w-0">
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="font-medium text-ink transition-colors hover:text-wine"
                    >
                      {order.customer.name}
                    </Link>
                    <p className="mt-0.5 text-xs text-ink/50">
                      {order.status} · {order.lines.length} item
                      {order.lines.length === 1 ? "" : "s"} ·{" "}
                      {new Date(order.createdAt).toLocaleString("en-PK")}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <p className="text-sm text-ink">
                      {order.subtotal === undefined
                        ? "—"
                        : formatPrice(order.subtotal, order.currency)}
                    </p>
                    <CallClientActions
                      phone={order.customer.phone}
                      name={order.customer.name}
                      compact
                    />
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </AdminShell>
  );
}
