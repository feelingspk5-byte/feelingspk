"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { FormEvent, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FABRIC_METER_OPTIONS } from "@/data/catalog";
import {
  DEFAULT_DRESS_SHIRT_SIZES,
  DEFAULT_SHALWAR_KAMEEZ_SIZES,
  PRODUCT_CATEGORY_LABELS,
  type Availability,
  type Collection,
  type ColourVariant,
  type CutOption,
  type Product,
  type ProductCategory,
  type SellingMethod,
  type SizeOption,
} from "@/lib/types";
import { newId } from "@/lib/store/ids";

const CATEGORIES = Object.keys(PRODUCT_CATEGORY_LABELS) as ProductCategory[];

export function ProductEditor({
  initial,
  collections,
}: {
  initial?: Product;
  collections: Collection[];
}) {
  const router = useRouter();
  const isNew = !initial;
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [name, setName] = useState(initial?.name ?? "");
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [sku, setSku] = useState(initial?.sku ?? "");
  const [category, setCategory] = useState<ProductCategory>(
    initial?.category ?? "unstitched_fabric",
  );
  const [description, setDescription] = useState(initial?.description ?? "");
  const [price, setPrice] = useState(
    initial?.price !== undefined ? String(initial.price) : "",
  );
  const [availability, setAvailability] = useState<Availability>(
    initial?.availability ?? "in_stock",
  );
  const [sellingMethod, setSellingMethod] = useState<SellingMethod>(
    initial?.sellingMethod ?? "fixed_cut",
  );
  const [fabricType, setFabricType] = useState(initial?.fabricType ?? "");
  const [composition, setComposition] = useState(initial?.composition ?? "");
  const [care, setCare] = useState(initial?.care ?? "");
  const [season, setSeason] = useState(initial?.season ?? "");
  const [featured, setFeatured] = useState(Boolean(initial?.featured));
  const [newArrival, setNewArrival] = useState(Boolean(initial?.newArrival));
  const [bestSeller, setBestSeller] = useState(Boolean(initial?.bestSeller));
  const [collectionSlugs, setCollectionSlugs] = useState<string[]>(
    initial?.collectionSlugs ?? [],
  );
  const [colours, setColours] = useState<ColourVariant[]>(
    initial?.colourVariants ?? [],
  );
  const [cutOptions, setCutOptions] = useState<CutOption[]>(
    initial?.cutOptions ??
      (category === "unstitched_fabric" ? [...FABRIC_METER_OPTIONS] : []),
  );
  const [sizeOptions, setSizeOptions] = useState<SizeOption[]>(
    initial?.sizeOptions ?? [],
  );
  const [imageSrc, setImageSrc] = useState(initial?.images?.[0]?.src ?? "");
  const [imageAlt, setImageAlt] = useState(initial?.images?.[0]?.alt ?? "");

  const categoryLabel = PRODUCT_CATEGORY_LABELS[category];

  const defaultSizes = useMemo(() => {
    if (category === "dress_shirt") return DEFAULT_DRESS_SHIRT_SIZES;
    if (category === "stitched_shalwar_kameez") return DEFAULT_SHALWAR_KAMEEZ_SIZES;
    return [];
  }, [category]);

  function toggleCollection(slug: string) {
    setCollectionSlugs((prev) =>
      prev.includes(slug) ? prev.filter((s) => s !== slug) : [...prev, slug],
    );
  }

  function addColour() {
    setColours((prev) => [
      ...prev,
      { id: newId("colr"), name: "", hex: "#888888", available: true },
    ]);
  }

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setError(null);

    const images =
      imageSrc.trim().length > 0
        ? [
            {
              id: initial?.images?.[0]?.id ?? newId("img"),
              src: imageSrc.trim(),
              alt: imageAlt.trim() || name,
              kind: "hero" as const,
            },
          ]
        : initial?.images ?? [];

    const payload: Partial<Product> = {
      name,
      slug: slug || undefined,
      sku: sku || undefined,
      category,
      description: description || undefined,
      price: price.trim() ? Number(price) : undefined,
      availability,
      sellingMethod,
      fabricType: fabricType || undefined,
      composition: composition || undefined,
      care: care || undefined,
      season: season || undefined,
      featured,
      newArrival,
      bestSeller,
      collectionSlugs,
      colourVariants: colours.filter((c) => c.name.trim()),
      cutOptions:
        category === "unstitched_fabric" ? cutOptions : initial?.cutOptions,
      sizeOptions:
        category !== "unstitched_fabric" ? sizeOptions : initial?.sizeOptions,
      images,
    };

    const res = await fetch(
      isNew ? "/api/admin/products" : `/api/admin/products/${initial!.id}`,
      {
        method: isNew ? "POST" : "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      },
    );
    const data = (await res.json()) as { error?: string; product?: Product };
    setBusy(false);
    if (!res.ok) {
      setError(data.error ?? "Could not save product.");
      return;
    }
    router.push("/admin/products");
    router.refresh();
  }

  async function onDelete() {
    if (!initial || !confirm("Delete this product from the storefront?")) return;
    setBusy(true);
    await fetch(`/api/admin/products/${initial.id}`, { method: "DELETE" });
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-[11px] uppercase tracking-[0.18em] text-wine">
            {isNew ? "New" : "Edit"} · {categoryLabel}
          </p>
          <h1 className="mt-2 font-display text-3xl tracking-tight">
            {isNew ? "Add product" : initial!.name}
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link
            href="/admin/products"
            className="inline-flex h-11 items-center border border-ink/20 px-4 text-sm"
          >
            Cancel
          </Link>
          {!isNew ? (
            <Button
              type="button"
              variant="outline"
              onClick={onDelete}
              disabled={busy}
            >
              Delete
            </Button>
          ) : null}
          <Button type="submit" disabled={busy}>
            {busy ? "Saving…" : "Save product"}
          </Button>
        </div>
      </div>

      {error ? <p className="text-sm text-wine">{error}</p> : null}

      <section className="grid gap-5 border border-ink/10 bg-ivory p-6 md:grid-cols-2">
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Name
          </span>
          <Input value={name} onChange={(e) => setName(e.target.value)} required />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Slug
          </span>
          <Input
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            placeholder="auto from name"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            SKU
          </span>
          <Input value={sku} onChange={(e) => setSku(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Category
          </span>
          <select
            className="flex h-11 w-full rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm"
            value={category}
            onChange={(e) => {
              const next = e.target.value as ProductCategory;
              setCategory(next);
              if (next === "unstitched_fabric" && cutOptions.length === 0) {
                setCutOptions([...FABRIC_METER_OPTIONS]);
              }
              if (next !== "unstitched_fabric" && sizeOptions.length === 0) {
                setSizeOptions(
                  next === "dress_shirt"
                    ? [...DEFAULT_DRESS_SHIRT_SIZES]
                    : [...DEFAULT_SHALWAR_KAMEEZ_SIZES],
                );
              }
            }}
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {PRODUCT_CATEGORY_LABELS[c]}
              </option>
            ))}
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Availability
          </span>
          <select
            className="flex h-11 w-full rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm"
            value={availability}
            onChange={(e) => setAvailability(e.target.value as Availability)}
          >
            <option value="in_stock">In stock</option>
            <option value="out_of_stock">Out of stock</option>
            <option value="unconfirmed">Coming soon / unconfirmed</option>
          </select>
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Price (PKR, optional)
          </span>
          <Input
            type="number"
            min={0}
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            placeholder="Leave blank for on request"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Selling method
          </span>
          <select
            className="flex h-11 w-full rounded-sm border border-ink/15 bg-stone/40 px-3 text-sm"
            value={sellingMethod}
            onChange={(e) => setSellingMethod(e.target.value as SellingMethod)}
          >
            <option value="fixed_cut">Fixed cut / metres</option>
            <option value="per_metre">Per metre</option>
            <option value="fixed_price">Fixed price</option>
            <option value="unconfirmed">Unconfirmed</option>
          </select>
        </label>
        <label className="block text-sm md:col-span-2">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Description
          </span>
          <Textarea
            rows={3}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Fabric type
          </span>
          <Input value={fabricType} onChange={(e) => setFabricType(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Composition
          </span>
          <Input
            value={composition}
            onChange={(e) => setComposition(e.target.value)}
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Season
          </span>
          <Input value={season} onChange={(e) => setSeason(e.target.value)} />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block text-[11px] uppercase tracking-[0.14em] text-ink/55">
            Care
          </span>
          <Input value={care} onChange={(e) => setCare(e.target.value)} />
        </label>
        <div className="flex flex-wrap gap-4 md:col-span-2">
          {[
            ["Featured", featured, setFeatured],
            ["New arrival", newArrival, setNewArrival],
            ["Best seller", bestSeller, setBestSeller],
          ].map(([label, value, setter]) => (
            <label key={String(label)} className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={value as boolean}
                onChange={(e) =>
                  (setter as (v: boolean) => void)(e.target.checked)
                }
              />
              {label as string}
            </label>
          ))}
        </div>
      </section>

      <section className="border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Collections</h2>
        <div className="mt-4 flex flex-wrap gap-3">
          {collections.map((c) => (
            <label
              key={c.id}
              className="flex items-center gap-2 border border-ink/10 px-3 py-2 text-sm"
            >
              <input
                type="checkbox"
                checked={collectionSlugs.includes(c.slug)}
                onChange={() => toggleCollection(c.slug)}
              />
              {c.name}
            </label>
          ))}
        </div>
      </section>

      <section className="border border-ink/10 bg-ivory p-6">
        <div className="flex items-center justify-between gap-4">
          <h2 className="font-display text-2xl">Colours</h2>
          <Button type="button" variant="outline" onClick={addColour}>
            Add colour
          </Button>
        </div>
        <div className="mt-4 space-y-3">
          {colours.length === 0 ? (
            <p className="text-sm text-ink/55">No colours yet.</p>
          ) : (
            colours.map((c, idx) => (
              <div
                key={c.id}
                className="grid gap-3 border border-ink/10 p-3 sm:grid-cols-[1fr_120px_auto_auto]"
              >
                <Input
                  placeholder="Colour name"
                  value={c.name}
                  onChange={(e) => {
                    const next = [...colours];
                    next[idx] = { ...c, name: e.target.value };
                    setColours(next);
                  }}
                />
                <Input
                  type="color"
                  value={c.hex ?? "#888888"}
                  onChange={(e) => {
                    const next = [...colours];
                    next[idx] = { ...c, hex: e.target.value };
                    setColours(next);
                  }}
                />
                <label className="flex items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={c.available !== false}
                    onChange={(e) => {
                      const next = [...colours];
                      next[idx] = { ...c, available: e.target.checked };
                      setColours(next);
                    }}
                  />
                  In stock
                </label>
                <button
                  type="button"
                  className="text-sm text-wine"
                  onClick={() =>
                    setColours((prev) => prev.filter((x) => x.id !== c.id))
                  }
                >
                  Remove
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {category === "unstitched_fabric" ? (
        <section className="border border-ink/10 bg-ivory p-6">
          <h2 className="font-display text-2xl">Metre / cut options</h2>
          <p className="mt-1 text-sm text-ink/55">
            Default metre lengths shown on the product page.
          </p>
          <div className="mt-4 space-y-2">
            {cutOptions.map((opt, idx) => (
              <div key={opt.id} className="grid gap-2 sm:grid-cols-3">
                <Input
                  value={opt.label}
                  onChange={(e) => {
                    const next = [...cutOptions];
                    next[idx] = { ...opt, label: e.target.value };
                    setCutOptions(next);
                  }}
                />
                <Input
                  type="number"
                  value={opt.quantity}
                  onChange={(e) => {
                    const next = [...cutOptions];
                    next[idx] = {
                      ...opt,
                      quantity: Number(e.target.value) || 0,
                    };
                    setCutOptions(next);
                  }}
                />
                <Input
                  value={opt.unit}
                  onChange={(e) => {
                    const next = [...cutOptions];
                    next[idx] = { ...opt, unit: e.target.value };
                    setCutOptions(next);
                  }}
                />
              </div>
            ))}
          </div>
        </section>
      ) : (
        <section className="border border-ink/10 bg-ivory p-6">
          <div className="flex items-center justify-between gap-4">
            <h2 className="font-display text-2xl">Sizes</h2>
            <Button
              type="button"
              variant="outline"
              onClick={() => setSizeOptions([...defaultSizes])}
            >
              Load defaults
            </Button>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {sizeOptions.map((s) => (
              <span
                key={s.id}
                className="border border-ink/15 px-3 py-1.5 text-sm"
              >
                {s.label}
              </span>
            ))}
            {sizeOptions.length === 0 ? (
              <p className="text-sm text-ink/55">No sizes — load defaults.</p>
            ) : null}
          </div>
        </section>
      )}

      <section className="border border-ink/10 bg-ivory p-6">
        <h2 className="font-display text-2xl">Primary image</h2>
        <p className="mt-1 text-sm text-ink/55">
          Paste a path from Media (e.g. /uploads/… or /catalogue/…).
        </p>
        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <Input
            placeholder="/uploads/…"
            value={imageSrc}
            onChange={(e) => setImageSrc(e.target.value)}
          />
          <Input
            placeholder="Alt text"
            value={imageAlt}
            onChange={(e) => setImageAlt(e.target.value)}
          />
        </div>
      </section>
    </form>
  );
}
