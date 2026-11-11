import { notFound, redirect } from "next/navigation";
import { PrintActions } from "@/components/admin/print-actions";
import { formatPrice } from "@/lib/format";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

type Props = { params: Promise<{ id: string }> };

export default async function OrderPrintPage({ params }: Props) {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");
  const { id } = await params;
  const store = readStore();
  const order = store.orders.find((o) => o.id === id);
  if (!order) notFound();
  const config = store.siteConfig;

  const total =
    order.subtotal === undefined
      ? undefined
      : Math.max(0, order.subtotal - (order.discountAmount ?? 0)) +
        (order.shippingAmount ?? 0);

  return (
    <div className="min-h-screen bg-ivory p-6 text-ink md:p-10">
      <style>{`
        @media print {
          .no-print { display: none !important; }
          body { background: white !important; }
        }
      `}</style>
      <div className="mx-auto max-w-3xl bg-white p-8 text-black shadow-none">
        <PrintActions orderId={order.id} />

        <header className="border-b border-black pb-4">
          <p className="text-xs uppercase tracking-[0.2em]">
            {config.brandName}
          </p>
          <h1 className="mt-2 font-display text-3xl">
            Invoice / Packing slip
          </h1>
          <p className="mt-1 text-sm">Order {order.id}</p>
          <p className="text-sm">
            Placed {new Date(order.createdAt).toLocaleString("en-PK")} ·{" "}
            {order.paymentMethod}
          </p>
        </header>

        <div className="mt-6 grid gap-6 text-sm sm:grid-cols-2">
          <div>
            <p className="text-xs uppercase tracking-widest">Ship to</p>
            <p className="mt-2 font-semibold">{order.customer.name}</p>
            <p>{order.delivery.address}</p>
            <p>
              {order.delivery.city}
              {order.delivery.postal ? ` ${order.delivery.postal}` : ""}
            </p>
            <p>{order.customer.phone}</p>
            <p>{order.customer.email}</p>
          </div>
          <div>
            <p className="text-xs uppercase tracking-widest">From</p>
            <p className="mt-2 font-semibold">{config.brandName}</p>
            {config.contactPhone ? <p>{config.contactPhone}</p> : null}
            {config.contactEmail ? <p>{config.contactEmail}</p> : null}
            {order.tracking ? (
              <p className="mt-2">Tracking: {order.tracking}</p>
            ) : null}
          </div>
        </div>

        <table className="mt-8 w-full border-collapse text-sm">
          <thead>
            <tr className="border-b border-black text-left">
              <th className="py-2">Item</th>
              <th className="py-2">Qty</th>
              <th className="py-2 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {order.lines.map((line) => (
              <tr key={line.key} className="border-b border-black/20">
                <td className="py-3">
                  <p>{line.productName}</p>
                  <p className="text-xs opacity-70">
                    {[line.colourName, line.cutLabel, line.sizeLabel]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>
                </td>
                <td className="py-3">{line.quantity}</td>
                <td className="py-3 text-right">
                  {line.unitPrice === undefined
                    ? "On request"
                    : formatPrice(
                        line.unitPrice * line.quantity,
                        line.currency,
                      )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="mt-6 ml-auto w-full max-w-xs space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>
              {order.subtotal === undefined
                ? "On request"
                : formatPrice(order.subtotal, order.currency)}
            </span>
          </div>
          {order.discountAmount ? (
            <div className="flex justify-between">
              <span>
                Discount
                {order.couponCode ? ` (${order.couponCode})` : ""}
              </span>
              <span>
                -{formatPrice(order.discountAmount, order.currency)}
              </span>
            </div>
          ) : null}
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>
              {formatPrice(order.shippingAmount ?? 0, order.currency)}
            </span>
          </div>
          <div className="flex justify-between border-t border-black pt-2 text-base font-semibold">
            <span>Total</span>
            <span>
              {total === undefined
                ? "On request"
                : formatPrice(total, order.currency)}
            </span>
          </div>
        </div>

        {order.delivery.notes ? (
          <p className="mt-8 text-sm">
            <strong>Delivery notes:</strong> {order.delivery.notes}
          </p>
        ) : null}
      </div>
    </div>
  );
}
