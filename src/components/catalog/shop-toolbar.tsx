"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { cn } from "@/lib/cn";
import { PRODUCT_CATEGORY_LABELS, type ProductCategory } from "@/lib/types";

const sorts = [
  { value: "featured", label: "Featured" },
  { value: "newest", label: "Newest" },
  { value: "price-asc", label: "Price: low to high" },
  { value: "price-desc", label: "Price: high to low" },
];

const categories = Object.entries(PRODUCT_CATEGORY_LABELS) as [
  ProductCategory,
  string,
][];

export function ShopToolbar({
  resultCount,
  availableCollections,
}: {
  resultCount: number;
  availableCollections: { slug: string; name: string }[];
}) {
  const router = useRouter();
  const params = useSearchParams();
  const sort = params.get("sort") ?? "featured";
  const collection = params.get("collection") ?? "";
  const category = params.get("category") ?? "";
  const filter = params.get("filter") ?? "";
  const q = params.get("q") ?? "";

  function update(next: Record<string, string | null>) {
    const sp = new URLSearchParams(params.toString());
    Object.entries(next).forEach(([key, value]) => {
      if (!value) sp.delete(key);
      else sp.set(key, value);
    });
    router.push(`/shop?${sp.toString()}`);
  }

  const chips: { key: string; label: string; clear: () => void }[] = [];
  if (category) {
    chips.push({
      key: "category",
      label:
        PRODUCT_CATEGORY_LABELS[category as ProductCategory] ?? category,
      clear: () => update({ category: null }),
    });
  }
  if (collection) {
    const name =
      availableCollections.find((c) => c.slug === collection)?.name ??
      collection;
    chips.push({
      key: "collection",
      label: name,
      clear: () => update({ collection: null }),
    });
  }
  if (filter === "new") {
    chips.push({
      key: "filter",
      label: "New arrivals",
      clear: () => update({ filter: null }),
    });
  }
  if (q) {
    chips.push({
      key: "q",
      label: `Search: ${q}`,
      clear: () => update({ q: null }),
    });
  }

  return (
    <div className="mb-6 space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-sm text-ink/70">
          {resultCount} product{resultCount === 1 ? "" : "s"}
        </p>
        <label className="flex items-center gap-2 text-sm text-ink">
          <span className="text-ink/60">Sort</span>
          <select
            className="h-10 rounded-sm border border-ink/20 bg-ivory px-3 text-sm"
            value={sort}
            onChange={(e) => update({ sort: e.target.value })}
            aria-label="Sort products"
          >
            {sorts.map((s) => (
              <option key={s.value} value={s.value}>
                {s.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => update({ category: null })}
          className={cn(
            "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
            !category
              ? "border-wine bg-wine text-ivory"
              : "border-ink/20 bg-ivory text-ink",
          )}
        >
          All
        </button>
        {categories.map(([slug, label]) => (
          <button
            key={slug}
            type="button"
            onClick={() => update({ category: slug })}
            className={cn(
              "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
              category === slug
                ? "border-wine bg-wine text-ivory"
                : "border-ink/20 bg-ivory text-ink",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      {availableCollections.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {availableCollections.map((c) => (
            <button
              key={c.slug}
              type="button"
              onClick={() => update({ collection: c.slug })}
              className={cn(
                "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
                collection === c.slug
                  ? "border-wine bg-wine text-ivory"
                  : "border-ink/20 bg-ivory text-ink",
              )}
            >
              {c.name}
            </button>
          ))}
        </div>
      ) : null}

      {chips.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2">
          {chips.map((chip) => (
            <button
              key={chip.key}
              type="button"
              onClick={chip.clear}
              className="rounded-sm border border-ink/15 bg-ivory px-2.5 py-1 text-xs text-ink"
            >
              {chip.label} ×
            </button>
          ))}
          <button
            type="button"
            className="text-xs uppercase tracking-[0.12em] text-wine"
            onClick={() => router.push("/shop")}
          >
            Clear all
          </button>
        </div>
      ) : null}
    </div>
  );
}
