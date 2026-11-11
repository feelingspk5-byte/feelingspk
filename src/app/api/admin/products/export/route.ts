import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

function csvEscape(value: string | number | undefined | null) {
  const s = value === undefined || value === null ? "" : String(value);
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const headers = [
    "id",
    "slug",
    "name",
    "sku",
    "category",
    "price",
    "availability",
    "publishStatus",
    "stockQty",
    "featured",
    "newArrival",
    "collectionSlugs",
    "colours",
  ];

  const rows = readStore().products.map((p) =>
    [
      p.id,
      p.slug,
      p.name,
      p.sku ?? "",
      p.category,
      p.price ?? "",
      p.availability,
      p.publishStatus ?? "published",
      p.stockQty ?? "",
      p.featured ? "1" : "0",
      p.newArrival ? "1" : "0",
      (p.collectionSlugs ?? []).join("|"),
      (p.colourVariants ?? [])
        .map((c) => `${c.name}:${c.hex ?? ""}`)
        .join("|"),
    ]
      .map(csvEscape)
      .join(","),
  );

  const csv = [headers.join(","), ...rows].join("\n");
  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="feelings-products.csv"',
    },
  });
}
