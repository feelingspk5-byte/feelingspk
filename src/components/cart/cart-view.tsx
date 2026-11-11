"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { useCart } from "@/lib/cart-context";
import { siteConfig } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function CartView() {
  const { lines, updateQuantity, removeLine, subtotal } = useCart();
  const config = siteConfig;

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Your cart is empty"
        description="Browse the FEELINGS Elite Men's Collection when products are uploaded, then add items here."
        className="py-16"
      />
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_320px]">
      <ul className="space-y-4">
        {lines.map((line) => (
          <li
            key={line.key}
            className="flex flex-col gap-4 rounded-sm border border-ink/10 bg-ivory p-4 sm:flex-row"
          >
            <div className="h-28 w-full shrink-0 rounded-sm bg-stone-deep/50 sm:w-24">
              {line.imageSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={line.imageSrc}
                  alt=""
                  className="h-full w-full rounded-sm object-cover"
                />
              ) : null}
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <Link
                    href={`/products/${line.productSlug}`}
                    className="font-medium text-ink hover:text-wine"
                  >
                    {line.productName}
                  </Link>
                  {line.colourName ? (
                    <p className="text-sm text-ink/60">Colour: {line.colourName}</p>
                  ) : null}
                  {line.cutLabel ? (
                    <p className="text-sm text-ink/60">Cut: {line.cutLabel}</p>
                  ) : null}
                  {line.sizeLabel ? (
                    <p className="text-sm text-ink/60">Size: {line.sizeLabel}</p>
                  ) : null}
                </div>
                <p className="text-sm text-ink">
                  {formatPrice(line.unitPrice, line.currency)}
                </p>
              </div>
              <div className="mt-auto flex items-center justify-between gap-3">
                <label className="flex items-center gap-2 text-sm">
                  Qty
                  <input
                    type="number"
                    min={1}
                    value={line.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        line.key,
                        Math.max(1, Number(e.target.value) || 1),
                      )
                    }
                    className="h-9 w-16 rounded-sm border border-ink/20 bg-stone px-2"
                  />
                </label>
                <button
                  type="button"
                  className="text-sm text-wine"
                  onClick={() => removeLine(line.key)}
                >
                  Remove
                </button>
              </div>
            </div>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-sm border border-ink/10 bg-ivory p-5">
        <h2 className="font-display text-2xl text-ink">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between gap-3">
            <dt className="text-ink/60">Subtotal</dt>
            <dd>
              {subtotal === undefined
                ? "Pending priced catalogue"
                : formatPrice(subtotal, config.currencyPlaceholder)}
            </dd>
          </div>
          <div className="flex justify-between gap-3">
            <dt className="text-ink/60">Shipping</dt>
            <dd className="text-ink/60">Calculated at checkout</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-ink/55">
          Payment and shipping are not connected yet. Checkout collects details
          for integration and will not place a real order.
        </p>
        <Link href="/checkout" className="mt-5 block">
          <Button className="w-full">Proceed to checkout</Button>
        </Link>
        <Link
          href="/shop"
          className="mt-3 block text-center text-sm text-ink/70 hover:text-ink"
        >
          Continue shopping
        </Link>
      </aside>
    </div>
  );
}
