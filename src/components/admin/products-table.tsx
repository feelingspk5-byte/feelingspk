"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { availabilityLabel, formatPrice } from "@/lib/format";
import {
  PRODUCT_CATEGORY_LABELS,
  type Product,
} from "@/lib/types";

type FilterId = "all" | "published" | "draft" | "out_of_stock" | "low_stock" | "featured";

const FILTERS: { id: FilterId; label: string }[] = [
  { id: "all", label: "All" },
  { id: "published", label: "Published" },
  { id: "draft", label: "Drafts" },
  { id: "out_of_stock", label: "Out of stock" },
  { id: "low_stock", label: "Low stock" },
  { id: "featured", label: "Featured" },
];

function isLowStock(p: Product) {
  if (p.stockQty === undefined) return false;
  return p.stockQty <= (p.lowStockThreshold ?? 5);
}

export function ProductsTable({ products }: { products: Product[] }) {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState<FilterId>("all");
  const [selected, setSelected] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);
  const [importMsg, setImportMsg] = useState<string | null>(null);

  const filtered = useMemo(() => {
    let list = products;
    if (filter === "published") {
      list = list.filter((p) => (p.publishStatus ?? "published") === "published");
    } else if (filter === "draft") {
      list = list.filter((p) => p.publishStatus === "draft");
    } else if (filter === "out_of_stock") {
      list = list.filter((p) => p.availability === "out_of_stock");
    } else if (filter === "low_stock") {
      list = list.filter(isLowStock);
    } else if (filter === "featured") {
      list = list.filter((p) => p.featured);
    }

    const q = query.trim().toLowerCase();
    if (!q) return list;
    return list.filter((p) => {
      const colours = (p.colourVariants ?? []).map((c) => c.name).join(" ");
      return [p.name, p.sku, p.slug, colours, PRODUCT_CATEGORY_LABELS[p.category]]
        .filter(Boolean)
        .join(" ")
        .toLowerCase()
        .includes(q);
    });
  }, [products, query, filter]);

  const allSelected =
    filtered.length > 0 && filtered.every((p) => selected.includes(p.id));

  function toggleAll() {
    if (allSelected) setSelected([]);
    else setSelected(filtered.map((p) => p.id));
  }

  async function runBulk(action: string) {
    if (!selected.length) return;
    if (action === "delete" && !confirm(`Delete ${selected.length} products?`)) {
      return;
    }
    setBusy(true);
    await fetch("/api/admin/products/bulk", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ids: selected, action }),
    });
    setBusy(false);
    setSelected([]);
    router.refresh();
  }

  async function onImport(file: File | null) {
    if (!file) return;
    setBusy(true);
    setImportMsg(null);
    const data = new FormData();
    data.set("file", file);
    const res = await fetch("/api/admin/products/import", {
      method: "POST",
      body: data,
    });
    const json = (await res.json()) as { created?: number; error?: string };
    setBusy(false);
    if (!res.ok) {
      setImportMsg(json.error ?? "Import failed.");
      return;
    }
    setImportMsg(`Imported ${json.created ?? 0} products as drafts.`);
    router.refresh();
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-2">
        {FILTERS.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={[
              "rounded-sm border px-3 py-1.5 text-xs uppercase tracking-[0.12em]",
              filter === f.id
                ? "border-ink bg-ink text-ivory"
                : "border-ink/15 text-ink/60 hover:border-ink/40",
            ].join(" ")}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <label className="relative block min-w-[16rem] flex-1 max-w-md">
          <span className="sr-only">Search products</span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Filter by name, SKU, colour…"
            className="h-11 w-full rounded-sm border border-ink/15 bg-ivory px-3 text-sm outline-none focus:border-wine"
          />
        </label>
        <button
          type="button"
          className="inline-flex h-11 items-center border border-ink px-4 text-sm"
          onClick={() => {
            window.location.assign("/api/admin/products/export");
          }}
        >
          Export CSV
        </button>
        <label className="inline-flex h-11 cursor-pointer items-center border border-ink px-4 text-sm">
          Import CSV
          <input
            type="file"
            accept=".csv,text/csv"
            className="hidden"
            onChange={(e) => onImport(e.target.files?.[0] ?? null)}
          />
        </label>
      </div>
      {importMsg ? <p className="text-sm text-ink/60">{importMsg}</p> : null}

      {selected.length > 0 ? (
        <div className="flex flex-wrap items-center gap-2 border border-ink/10 bg-stone/40 px-4 py-3 text-sm">
          <span className="mr-2 text-ink/60">{selected.length} selected</span>
          <Button type="button" size="sm" disabled={busy} onClick={() => runBulk("publish")}>
            Publish
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => runBulk("draft")}>
            Draft
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => runBulk("in_stock")}>
            In stock
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => runBulk("out_of_stock")}>
            Out of stock
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => runBulk("feature")}>
            Feature
          </Button>
          <Button type="button" size="sm" variant="outline" disabled={busy} onClick={() => runBulk("delete")}>
            Delete
          </Button>
        </div>
      ) : null}

      <div className="overflow-x-auto border border-ink/10 bg-ivory">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="border-b border-ink/10 text-[11px] uppercase tracking-[0.14em] text-ink/45">
            <tr>
              <th className="px-4 py-3">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="px-4 py-3 font-medium">Product</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Stock</th>
              <th className="px-4 py-3 font-medium">Price</th>
              <th className="px-4 py-3 font-medium" />
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => {
              const img = p.images.find((i) => i.src)?.src;
              const pub = p.publishStatus ?? "published";
              return (
                <tr key={p.id} className="border-b border-ink/10 last:border-0">
                  <td className="px-4 py-3">
                    <input
                      type="checkbox"
                      checked={selected.includes(p.id)}
                      onChange={(e) =>
                        setSelected((prev) =>
                          e.target.checked
                            ? [...prev, p.id]
                            : prev.filter((id) => id !== p.id),
                        )
                      }
                    />
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="relative h-12 w-10 shrink-0 overflow-hidden bg-stone">
                        {img ? (
                          <Image src={img} alt="" fill sizes="40px" className="object-cover" />
                        ) : null}
                      </div>
                      <div>
                        <p className="font-medium text-ink">{p.name}</p>
                        <p className="text-xs text-ink/45">
                          {p.sku ?? p.slug} · {PRODUCT_CATEGORY_LABELS[p.category]}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 capitalize text-ink/70">
                    {pub}
                    {p.featured ? " · featured" : ""}
                  </td>
                  <td className="px-4 py-3 text-ink/70">
                    {availabilityLabel(p.availability)}
                    {p.stockQty !== undefined ? ` · ${p.stockQty}` : ""}
                    {isLowStock(p) ? (
                      <span className="ml-1 text-wine">low</span>
                    ) : null}
                  </td>
                  <td className="px-4 py-3 text-ink/70">{formatPrice(p.price)}</td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/products/${p.id}`}
                      className="text-sm text-wine hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={6} className="px-4 py-8 text-ink/55">
                  No products match this view.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
