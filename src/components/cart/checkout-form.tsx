"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import { siteConfig } from "@/data/catalog";
import { formatPrice } from "@/lib/format";

export function CheckoutForm() {
  const { lines, subtotal, clearCart } = useCart();
  const { user, ready } = useAuth();
  const config = siteConfig;
  const [status, setStatus] = useState<"idle" | "submitting" | "placed">(
    "idle",
  );
  const [note, setNote] = useState<string | null>(null);

  const wa = config.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`
    : null;

  if (lines.length === 0 && status !== "placed") {
    return (
      <EmptyState
        title="Nothing to check out"
        description="Add pieces from the shop, then return here to complete your order."
        action={
          <Link
            href="/shop"
            className="inline-flex h-11 items-center rounded-sm bg-ink px-5 text-sm text-ivory"
          >
            Browse the collection
          </Link>
        }
      />
    );
  }

  if (ready && !user) {
    return (
      <EmptyState
        title="Sign in to continue"
        description="Create an account or sign in before completing checkout. Your cart stays saved on this device."
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

  async function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setNote(null);

    const form = e.currentTarget;
    const data = new FormData(form);

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: String(data.get("name") ?? ""),
            email: String(data.get("email") ?? ""),
            phone: String(data.get("phone") ?? ""),
          },
          delivery: {
            address: String(data.get("address") ?? ""),
            city: String(data.get("city") ?? ""),
            postal: String(data.get("postal") ?? ""),
            notes: String(data.get("notes") ?? ""),
          },
          paymentMethod: "Cash on Delivery",
          lines: lines.map((line) => ({
            key: line.key,
            productId: line.productId,
            productSlug: line.productSlug,
            productName: line.productName,
            colourName: line.colourName,
            cutLabel: line.cutLabel,
            sizeLabel: line.sizeLabel,
            quantity: line.quantity,
            unitPrice: line.unitPrice,
            currency: line.currency,
            imageSrc: line.imageSrc,
          })),
        }),
      });

      if (!res.ok) {
        const err = (await res.json()) as { error?: string };
        setStatus("idle");
        setNote(err.error ?? "Could not place order. Please try again.");
        return;
      }

      setStatus("placed");
      setNote(
        "Your Cash on Delivery order request has been received. FEELINGS will confirm details on WhatsApp before dispatch. No online payment was taken.",
      );
      clearCart();
    } catch {
      setStatus("idle");
      setNote("Could not place order. Check your connection and try again.");
    }
  }

  if (status === "placed") {
    return (
      <div className="mx-auto max-w-2xl border border-ink/10 bg-ivory px-6 py-12 text-center md:px-10 md:py-16">
        <p className="text-[11px] uppercase tracking-[0.22em] text-wine">
          Order request received
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
          Thank you for choosing FEELINGS
        </h2>
        <p className="mx-auto mt-4 max-w-md text-sm leading-relaxed text-ink/70">
          {note}
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {wa ? (
            <a
              href={wa}
              target="_blank"
              rel="noreferrer"
              className="inline-flex h-12 items-center rounded-sm bg-ink px-6 text-sm tracking-wide text-ivory"
            >
              Confirm on WhatsApp
            </a>
          ) : null}
          <Link
            href="/shop"
            className="inline-flex h-12 items-center rounded-sm border border-ink px-6 text-sm tracking-wide text-ink"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_360px] lg:gap-12">
      <form onSubmit={onSubmit} className="space-y-6" noValidate={false}>
        <section className="border border-ink/10 bg-ivory p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Customer details
            </h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
              01
            </span>
          </div>
          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            <label className="block text-sm">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Full name
              </span>
              <Input
                name="name"
                required
                autoComplete="name"
                defaultValue={user?.name ?? ""}
                placeholder="Your full name"
              />
            </label>
            <label className="block text-sm">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Email
              </span>
              <Input
                name="email"
                type="email"
                required
                autoComplete="email"
                defaultValue={user?.email ?? ""}
                placeholder="you@email.com"
              />
            </label>
            <label className="block text-sm sm:col-span-2">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Phone / WhatsApp
              </span>
              <Input
                name="phone"
                type="tel"
                required
                autoComplete="tel"
                placeholder="03XX XXXXXXX"
              />
            </label>
          </div>
        </section>

        <section className="border border-ink/10 bg-ivory p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Delivery
            </h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
              02
            </span>
          </div>
          <div className="mt-6 grid gap-5">
            <label className="block text-sm">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Address line
              </span>
              <Input
                name="address"
                required
                autoComplete="street-address"
                placeholder="House / street / area"
              />
            </label>
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="block text-sm">
                <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                  City
                </span>
                <Input
                  name="city"
                  required
                  autoComplete="address-level2"
                  placeholder="Lahore"
                />
              </label>
              <label className="block text-sm">
                <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                  Postal code
                  <span className="normal-case tracking-normal text-ink/40">
                    {" "}
                    (optional)
                  </span>
                </span>
                <Input name="postal" autoComplete="postal-code" />
              </label>
            </div>
            <label className="block text-sm">
              <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
                Delivery notes
                <span className="normal-case tracking-normal text-ink/40">
                  {" "}
                  (optional)
                </span>
              </span>
              <Textarea
                name="notes"
                rows={3}
                placeholder="Landmark, preferred time, gate instructions…"
              />
            </label>
          </div>
          <p className="mt-5 text-sm text-ink/55">
            Delivery charges are confirmed with your order on WhatsApp before
            dispatch.
          </p>
        </section>

        <section className="border border-ink/10 bg-ivory p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Payment
            </h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
              03
            </span>
          </div>

          <div className="mt-6">
            <label className="flex cursor-pointer items-start gap-4 border border-wine bg-wine/[0.04] p-5 transition-colors">
              <input
                type="radio"
                name="payment"
                value="Cash on Delivery"
                defaultChecked
                required
                className="mt-1 h-4 w-4 accent-[var(--wine)]"
              />
              <span className="flex-1">
                <span className="flex flex-wrap items-center gap-2">
                  <span className="font-display text-xl text-ink">
                    Cash on Delivery
                  </span>
                  <span className="rounded-sm bg-ink px-2 py-0.5 text-[10px] uppercase tracking-[0.14em] text-ivory">
                    Available
                  </span>
                </span>
                <span className="mt-2 block text-sm leading-relaxed text-ink/65">
                  Pay in cash when your FEELINGS order arrives. No online card
                  payment is required for now.
                </span>
              </span>
            </label>
          </div>
        </section>

        <div className="flex flex-col gap-4 border-t border-ink/10 pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Link
            href="/cart"
            className="text-sm tracking-wide text-ink/55 transition-colors hover:text-wine"
          >
            ← Back to cart
          </Link>
          <Button
            type="submit"
            size="lg"
            className="w-full sm:w-auto sm:min-w-[14rem]"
            disabled={status === "submitting"}
          >
            {status === "submitting"
              ? "Placing request…"
              : "Place COD order request"}
          </Button>
        </div>
        {status === "idle" && note ? (
          <p className="text-sm text-wine">{note}</p>
        ) : null}
      </form>

      <aside className="h-fit border border-ink/10 bg-stone/40 p-6 md:sticky md:top-28 md:p-7">
        <p className="text-[11px] uppercase tracking-[0.2em] text-wine">
          Your order
        </p>
        <h2 className="mt-2 font-display text-2xl text-ink">Order summary</h2>

        <ul className="mt-6 space-y-4">
          {lines.map((line) => (
            <li
              key={line.key}
              className="flex gap-3 border-b border-ink/10 pb-4"
            >
              <div className="relative h-20 w-16 shrink-0 overflow-hidden bg-ivory">
                {line.imageSrc ? (
                  <Image
                    src={line.imageSrc}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-ink">
                  {line.productName}
                </p>
                <p className="mt-1 text-xs leading-relaxed text-ink/55">
                  Qty {line.quantity}
                  {line.colourName ? ` · ${line.colourName}` : ""}
                  {line.cutLabel ? ` · ${line.cutLabel}` : ""}
                  {line.sizeLabel ? ` · Size ${line.sizeLabel}` : ""}
                </p>
                <p className="mt-2 text-sm text-ink">
                  {formatPrice(line.unitPrice, line.currency)}
                </p>
              </div>
            </li>
          ))}
        </ul>

        <div className="mt-5 space-y-2 text-sm">
          <div className="flex justify-between">
            <span className="text-ink/55">Subtotal</span>
            <span className="text-ink">
              {subtotal === undefined
                ? "On confirmation"
                : formatPrice(subtotal, config.currencyPlaceholder)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">Shipping</span>
            <span className="text-ink/70">Confirmed on WhatsApp</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">Payment</span>
            <span className="font-medium text-ink">Cash on Delivery</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink/15 pt-3 font-display text-xl text-ink">
            <span>Total</span>
            <span>
              {subtotal === undefined
                ? "Pending"
                : formatPrice(subtotal, config.currencyPlaceholder)}
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-ink/50">
          Prices marked “on request” are confirmed with you before dispatch.
          Cash is collected on delivery.
        </p>
      </aside>
    </div>
  );
}
