"use client";

import Image from "next/image";
import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { EmptyState } from "@/components/ui/empty-state";
import { useAuth } from "@/lib/auth-context";
import { useCart } from "@/lib/cart-context";
import {
  loadCheckoutProfile,
  saveCheckoutProfile,
  type CheckoutProfile,
} from "@/lib/checkout-profile";
import { formatPrice } from "@/lib/format";
import type { SiteConfig } from "@/lib/types";

type FormFields = {
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  postal: string;
  notes: string;
  coupon: string;
};

const emptyFields = (seed?: { name?: string; email?: string }): FormFields => ({
  name: seed?.name ?? "",
  email: seed?.email ?? "",
  phone: "",
  address: "",
  city: "",
  postal: "",
  notes: "",
  coupon: "",
});

export function CheckoutForm({
  siteConfig,
}: {
  siteConfig: Pick<
    SiteConfig,
    "currencyPlaceholder" | "whatsapp" | "contactPhone" | "brandName"
  >;
}) {
  const { lines, subtotal, clearCart } = useCart();
  const { user, ready } = useAuth();
  const config = siteConfig;
  const [status, setStatus] = useState<"idle" | "submitting" | "placed">(
    "idle",
  );
  const [note, setNote] = useState<string | null>(null);
  const [fields, setFields] = useState<FormFields>(() => emptyFields());
  const [savedProfile, setSavedProfile] = useState<CheckoutProfile | null>(
    null,
  );
  const [offerAutofill, setOfferAutofill] = useState(false);
  const [autofilled, setAutofilled] = useState(false);

  const wa = config.whatsapp
    ? `https://wa.me/${config.whatsapp.replace(/\D/g, "").replace(/^0/, "92")}`
    : null;

  useEffect(() => {
    if (!ready) return;
    setFields((prev) => ({
      ...prev,
      name: prev.name || user?.name || "",
      email: prev.email || user?.email || "",
    }));
    const profile = loadCheckoutProfile(user?.email);
    if (profile) {
      setSavedProfile(profile);
      setOfferAutofill(true);
    }
  }, [ready, user?.email, user?.name]);

  function updateField<K extends keyof FormFields>(key: K, value: FormFields[K]) {
    setFields((prev) => ({ ...prev, [key]: value }));
  }

  function applySavedDetails() {
    if (!savedProfile) return;
    setFields((prev) => ({
      ...prev,
      name: savedProfile.name,
      email: savedProfile.email || user?.email || prev.email,
      phone: savedProfile.phone,
      address: savedProfile.address,
      city: savedProfile.city,
      postal: savedProfile.postal,
      notes: savedProfile.notes,
    }));
    setAutofilled(true);
    setOfferAutofill(false);
  }

  function dismissAutofill() {
    setOfferAutofill(false);
  }

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

    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: {
            name: fields.name,
            email: fields.email,
            phone: fields.phone,
          },
          delivery: {
            address: fields.address,
            city: fields.city,
            postal: fields.postal,
            notes: fields.notes,
          },
          paymentMethod: "Cash on Delivery",
          couponCode: fields.coupon,
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

      saveCheckoutProfile({
        name: fields.name.trim(),
        email: fields.email.trim(),
        phone: fields.phone.trim(),
        address: fields.address.trim(),
        city: fields.city.trim(),
        postal: fields.postal.trim(),
        notes: fields.notes.trim(),
      });

      setStatus("placed");
      setNote(
        "Thank you for your order. The FEELINGS team will contact you shortly to confirm.",
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
          Order placed
        </p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink md:text-4xl">
          Thank you
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
              Message FEELINGS
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
        {offerAutofill && savedProfile ? (
          <div className="flex flex-col gap-4 border border-wine/25 bg-wine/[0.04] p-5 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-wine">
                Returning client
              </p>
              <p className="mt-1 text-sm leading-relaxed text-ink/75">
                We found details from your last FEELINGS order
                {savedProfile.city ? ` in ${savedProfile.city}` : ""}. Fill them
                in with one tap?
              </p>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <Button type="button" size="sm" onClick={applySavedDetails}>
                Use saved details
              </Button>
              <Button
                type="button"
                size="sm"
                variant="ghost"
                onClick={dismissAutofill}
              >
                Enter new
              </Button>
            </div>
          </div>
        ) : null}

        {autofilled ? (
          <p className="text-sm text-ink/60">
            Details from your last order are filled in. Edit anything that
            changed.
          </p>
        ) : null}

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
                value={fields.name}
                onChange={(e) => updateField("name", e.target.value)}
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
                value={fields.email}
                onChange={(e) => updateField("email", e.target.value)}
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
                value={fields.phone}
                onChange={(e) => updateField("phone", e.target.value)}
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
                value={fields.address}
                onChange={(e) => updateField("address", e.target.value)}
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
                  value={fields.city}
                  onChange={(e) => updateField("city", e.target.value)}
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
                <Input
                  name="postal"
                  autoComplete="postal-code"
                  value={fields.postal}
                  onChange={(e) => updateField("postal", e.target.value)}
                />
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
                value={fields.notes}
                onChange={(e) => updateField("notes", e.target.value)}
                placeholder="Landmark, preferred time, gate instructions…"
              />
            </label>
          </div>
          <p className="mt-5 text-sm text-ink/55">
            Delivery is arranged after your order is placed. We will call you on
            the number you provide.
          </p>
        </section>

        <section className="border border-ink/10 bg-ivory p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Offer code
            </h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
              03
            </span>
          </div>
          <label className="mt-6 block text-sm">
            <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
              Coupon (optional)
            </span>
            <Input
              name="coupon"
              placeholder="Enter code from FEELINGS"
              autoComplete="off"
              value={fields.coupon}
              onChange={(e) => updateField("coupon", e.target.value)}
            />
          </label>
        </section>

        <section className="border border-ink/10 bg-ivory p-6 md:p-8">
          <div className="flex items-baseline justify-between gap-4 border-b border-ink/10 pb-4">
            <h2 className="font-display text-2xl text-ink md:text-3xl">
              Payment
            </h2>
            <span className="text-[11px] uppercase tracking-[0.16em] text-ink/40">
              04
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
            {status === "submitting" ? "Placing order…" : "Place COD order"}
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
                ? "—"
                : formatPrice(subtotal, config.currencyPlaceholder)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">Shipping</span>
            <span className="text-ink/70">Shared on call</span>
          </div>
          <div className="flex justify-between">
            <span className="text-ink/55">Payment</span>
            <span className="font-medium text-ink">Cash on Delivery</span>
          </div>
          <div className="mt-3 flex justify-between border-t border-ink/15 pt-3 font-display text-xl text-ink">
            <span>Total</span>
            <span>
              {subtotal === undefined
                ? "—"
                : formatPrice(subtotal, config.currencyPlaceholder)}
            </span>
          </div>
        </div>

        <p className="mt-5 text-xs leading-relaxed text-ink/50">
          Cash on Delivery. Our team will call you shortly to confirm your
          order.
        </p>
      </aside>
    </div>
  );
}
