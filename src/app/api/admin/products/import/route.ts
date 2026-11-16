import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { updateStore } from "@/lib/store/file-store";
import { newId, slugify } from "@/lib/store/ids";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { Product, ProductCategory } from "@/lib/types";

function parseCsv(text: string): string[][] {
  const rows: string[][] = [];
  let row: string[] = [];
  let cell = "";
  let inQuotes = false;
  for (let i = 0; i < text.length; i++) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"' && text[i + 1] === '"') {
        cell += '"';
        i++;
      } else if (ch === '"') {
        inQuotes = false;
      } else {
        cell += ch;
      }
    } else if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(cell);
      cell = "";
    } else if (ch === "\n") {
      row.push(cell);
      rows.push(row);
      row = [];
      cell = "";
    } else if (ch !== "\r") {
      cell += ch;
    }
  }
  if (cell.length || row.length) {
    row.push(cell);
    rows.push(row);
  }
  return rows.filter((r) => r.some((c) => c.trim()));
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  if (!(file instanceof File)) {
    return NextResponse.json({ error: "CSV file required." }, { status: 400 });
  }

  const text = await file.text();
  const rows = parseCsv(text);
  if (rows.length < 2) {
    return NextResponse.json({ error: "CSV has no data rows." }, { status: 400 });
  }

  const header = rows[0].map((h) => h.trim().toLowerCase());
  const idx = (name: string) => header.indexOf(name);
  const nameI = idx("name");
  if (nameI < 0) {
    return NextResponse.json({ error: "CSV needs a name column." }, { status: 400 });
  }

  let created = 0;
  await updateStore((draft) => {
    for (const raw of rows.slice(1)) {
      const name = raw[nameI]?.trim();
      if (!name) continue;
      const slugRaw = idx("slug") >= 0 ? raw[idx("slug")] : name;
      let slug = slugify(slugRaw || name);
      let n = 2;
      while (draft.products.some((p) => p.slug === slug)) {
        slug = `${slugify(name)}-${n++}`;
      }
      const category = (raw[idx("category")]?.trim() ||
        "unstitched_fabric") as ProductCategory;
      const coloursRaw = idx("colours") >= 0 ? raw[idx("colours")] : "";
      const colourVariants = coloursRaw
        ? coloursRaw.split("|").map((part) => {
            const [cname, hex] = part.split(":");
            return {
              id: newId("colr"),
              name: (cname || "Shade").trim(),
              hex: hex?.trim() || undefined,
              available: true,
            };
          })
        : [];

      const product: Product = {
        id: newId("prod"),
        slug,
        name,
        category,
        sku: idx("sku") >= 0 ? raw[idx("sku")]?.trim() || undefined : undefined,
        price:
          idx("price") >= 0 && raw[idx("price")]
            ? Number(raw[idx("price")])
            : undefined,
        currency: "PKR",
        collectionSlugs:
          idx("collectionslugs") >= 0 && raw[idx("collectionslugs")]
            ? raw[idx("collectionslugs")].split("|").map((s) => s.trim()).filter(Boolean)
            : [],
        sellingMethod: "fixed_cut",
        colourVariants,
        images: [],
        availability:
          (raw[idx("availability")]?.trim() as Product["availability"]) ||
          "in_stock",
        publishStatus:
          (raw[idx("publishstatus")]?.trim() as Product["publishStatus"]) ||
          "draft",
        stockQty:
          idx("stockqty") >= 0 && raw[idx("stockqty")]
            ? Number(raw[idx("stockqty")])
            : undefined,
        featured: raw[idx("featured")] === "1",
        newArrival: raw[idx("newarrival")] === "1",
        updatedAt: new Date().toISOString(),
      };
      draft.products.unshift(product);
      created++;
    }
    pushAudit(draft, session.email, "products.csv_import", `${created} rows`);
  });
  revalidateStorefront();

  return NextResponse.json({ ok: true, created });
}
