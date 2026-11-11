import { redirect } from "next/navigation";
import { AdminShell } from "@/components/admin/admin-shell";
import { formatPrice } from "@/lib/format";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export default async function AdminAnalyticsPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const store = readStore();
  const orders = store.orders.filter((o) => o.status !== "cancelled");
  const revenue = orders.reduce((sum, o) => {
    const base = o.subtotal ?? 0;
    const discount = o.discountAmount ?? 0;
    return sum + Math.max(0, base - discount) + (o.shippingAmount ?? 0);
  }, 0);
  const aov = orders.length ? revenue / orders.length : 0;
  const pending = store.orders.filter((o) => o.status === "pending").length;
  const delivered = store.orders.filter((o) => o.status === "delivered").length;

  const colourHits = new Map<string, number>();
  for (const order of orders) {
    for (const line of order.lines) {
      if (!line.colourName) continue;
      colourHits.set(
        line.colourName,
        (colourHits.get(line.colourName) ?? 0) + line.quantity,
      );
    }
  }
  const topColours = [...colourHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  const productHits = new Map<string, number>();
  for (const order of orders) {
    for (const line of order.lines) {
      productHits.set(
        line.productName,
        (productHits.get(line.productName) ?? 0) + line.quantity,
      );
    }
  }
  const topProducts = [...productHits.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8);

  return (
    <AdminShell email={session.email}>
      <div className="space-y-8">
        <div>
          <h1 className="font-display text-3xl tracking-tight">Analytics</h1>
          <p className="mt-2 text-sm text-ink/60">
            COD performance from live order data.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: "Orders", value: String(orders.length) },
            { label: "Revenue", value: formatPrice(revenue) },
            { label: "Avg order", value: formatPrice(aov) },
            {
              label: "Pending / delivered",
              value: `${pending} / ${delivered}`,
            },
          ].map((card) => (
            <div
              key={card.label}
              className="border border-ink/10 bg-ivory p-5"
            >
              <p className="text-[11px] uppercase tracking-[0.16em] text-ink/45">
                {card.label}
              </p>
              <p className="mt-3 font-display text-2xl text-ink">{card.value}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <section className="border border-ink/10 bg-ivory p-6">
            <h2 className="font-display text-2xl">Top products</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {topProducts.map(([name, qty]) => (
                <li
                  key={name}
                  className="flex justify-between py-3 text-sm"
                >
                  <span>{name}</span>
                  <span className="text-ink/55">{qty}</span>
                </li>
              ))}
              {topProducts.length === 0 ? (
                <li className="py-4 text-sm text-ink/55">No sales yet.</li>
              ) : null}
            </ul>
          </section>
          <section className="border border-ink/10 bg-ivory p-6">
            <h2 className="font-display text-2xl">Top colours</h2>
            <ul className="mt-4 divide-y divide-ink/10">
              {topColours.map(([name, qty]) => (
                <li
                  key={name}
                  className="flex justify-between py-3 text-sm"
                >
                  <span>{name}</span>
                  <span className="text-ink/55">{qty}</span>
                </li>
              ))}
              {topColours.length === 0 ? (
                <li className="py-4 text-sm text-ink/55">No colour data yet.</li>
              ) : null}
            </ul>
          </section>
        </div>

        <section className="border border-ink/10 bg-ivory p-6">
          <h2 className="font-display text-2xl">Catalogue health</h2>
          <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-3">
            <div>
              <dt className="text-ink/45">Products</dt>
              <dd className="font-display text-xl">{store.products.length}</dd>
            </div>
            <div>
              <dt className="text-ink/45">In stock</dt>
              <dd className="font-display text-xl">
                {
                  store.products.filter((p) => p.availability === "in_stock")
                    .length
                }
              </dd>
            </div>
            <div>
              <dt className="text-ink/45">Active offers</dt>
              <dd className="font-display text-xl">
                {store.offers.filter((o) => o.active).length}
              </dd>
            </div>
          </dl>
        </section>
      </div>
    </AdminShell>
  );
}
