"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { formatPrice, getSiteConfig } from "@/lib/catalog";

export function CheckoutForm() {
  const { lines, subtotal, clearCart } = useCart();
  const { user, ready } = useAuth();
  const config = getSiteConfig();
  const [status, setStatus] = useState<"idle" | "submitting" | "blocked">(
    "idle",
  );
  const [note, setNote] = useState<string | null>(null);

  if (lines.length === 0) {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Add fabric from the shop, choose colour and length, then return here."
      />
    );
  }

  if (ready && !user) {
    return (
      <EmptyState
        title="Sign in to continue"
        description="Create an account or sign in before completing payment details. Your cart stays saved on this device."
        action={
          <Link
            href="/sign-in?next=/checkout&notice=checkout"
            className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm text-ivory"
          >
            Sign in
          </Link>
        }
      />
    );
  }

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");

    // Integration point: connect payment / order API here.
    // Never pretend a real order was placed.
    window.setTimeout(() => {
      setStatus("blocked");
      setNote(
        "Checkout is structurally complete, but payment and order fulfilment are not connected yet. No order was placed and no payment was taken.",
      );
    }, 600);
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_340px]">
      <form onSubmit={onSubmit} className="space-y-8" noValidate={false}>
        <section className="rounded-sm border border-ink/10 bg-ivory p-5">
          <h2 className="font-display text-2xl">Customer details</h2>
          <div className="mt-4 grid gap-4 sm:grid-cols-2">
            <label className="block text-sm sm:col-span-1">
              <span className="mb-1.5 block text-ink/70">Full name</span>
              <Input name="name" required autoComplete="name" />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/70">Email</span>
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block text-ink/70">Phone / WhatsApp</span>
              <Input name="phone" type="tel" required autoComplete="tel" />
            </label>
          </div>
        </section>

        <section className="rounded-sm border border-ink/10 bg-ivory p-5">
          <h2 className="font-display text-2xl">Delivery</h2>
          <div className="mt-4 grid gap-4">
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/70">Address line</span>
              <Input name="address" required autoComplete="street-address" />
            </label>
            <div className="grid gap-4 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-ink/70">City</span>
                <Input name="city" required autoComplete="address-level2" />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-ink/70">
                  Postal code (optional)
                </span>
                <Input name="postal" autoComplete="postal-code" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block text-ink/70">Delivery notes</span>
              <Textarea name="notes" rows={3} />
            </label>
          </div>
          {!config.shippingConnected ? (
            <p className="mt-4 text-sm text-ink/60">
              Shipping zones and charges will appear after FEELINGS confirms
              delivery destinations and rates.
            </p>
          ) : null}
        </section>

        <section className="rounded-sm border border-ink/10 bg-ivory p-5">
          <h2 className="font-display text-2xl">Payment</h2>
          {config.paymentMethods.length === 0 ? (
            <p className="mt-3 text-sm text-ink/65">
              Supported payment methods (for example COD, card, bank transfer)
              will be listed here only after FEELINGS confirms them. No payment
              is collected in this preview.
            </p>
          ) : (
            <ul className="mt-3 space-y-2 text-sm">
              {config.paymentMethods.map((method) => (
                <li key={method}>
                  <label className="flex items-center gap-2">
                    <input type="radio" name="payment" value={method} required />
                    {method}
                  </label>
                </li>
              ))}
            </ul>
          )}
        </section>

        {note ? (
          <div
            className="rounded-sm border border-wine/30 bg-wine/5 px-4 py-3 text-sm text-ink"
            role="status"
          >
            {note}
            <div className="mt-3 flex flex-wrap gap-3">
              <Button
                type="button"
                variant="secondary"
                onClick={() => clearCart()}
              >
                Clear cart
              </Button>
              <Link href="/shop" className="text-sm text-wine underline">
                Return to shop
              </Link>
            </div>
          </div>
        ) : null}

        <Button
          type="submit"
          className="w-full sm:w-auto"
          disabled={status === "submitting" || status === "blocked"}
        >
          {status === "submitting" ? "Checking…" : "Place order request"}
        </Button>
      </form>

      <aside className="h-fit rounded-sm border border-ink/10 bg-ivory p-5">
        <h2 className="font-display text-2xl">Fabric order</h2>
        <ul className="mt-4 space-y-3 text-sm">
          {lines.map((line) => (
            <li key={line.key} className="flex justify-between gap-3 border-b border-ink/10 pb-3">
              <div>
                <p className="font-medium">{line.productName}</p>
                <p className="text-ink/60">
                  Qty {line.quantity}
                  {line.colourName ? ` · ${line.colourName}` : ""}
                  {line.cutLabel ? ` · ${line.cutLabel}` : ""}
                  {line.sizeLabel ? ` · Size ${line.sizeLabel}` : ""}
                </p>
              </div>
              <p>{formatPrice(line.unitPrice, line.currency)}</p>
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between text-sm">
          <span className="text-ink/60">Subtotal</span>
          <span>
            {subtotal === undefined
              ? "Pending priced catalogue"
              : formatPrice(subtotal, config.currencyPlaceholder)}
          </span>
        </div>
        <p className="mt-4 text-xs text-ink/55">
          Final total including shipping will show once rates and payment are
          connected. This screen will not invent charges.
        </p>
      </aside>
    </div>
  );
}
