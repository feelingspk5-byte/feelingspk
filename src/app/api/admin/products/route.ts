import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { newId, slugify } from "@/lib/store/ids";
import { parsePrice } from "@/lib/store/price";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { Product } from "@/lib/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureStore();
  return NextResponse.json({ products: readStore().products });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await ensureStore();
  const body = (await request.json()) as Partial<Product>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const id = newId("prod");
  const slugBase = slugify(body.slug || body.name);
  const store = readStore();
  let slug = slugBase || id;
  let n = 2;
  while (store.products.some((p) => p.slug === slug)) {
    slug = `${slugBase}-${n++}`;
  }

  const price = parsePrice(body.price);
  const cutOptions = (body.cutOptions ?? []).map((cut) => ({
    ...cut,
    price: price !== undefined ? price : parsePrice(cut.price),
  }));

  const product: Product = {
    id,
    slug,
    name: body.name.trim(),
    category: body.category ?? "unstitched_fabric",
    sku: body.sku?.trim() || undefined,
    description: body.description?.trim() || undefined,
    price,
    currency: body.currency ?? store.siteConfig.currencyPlaceholder ?? "PKR",
    collectionSlugs: body.collectionSlugs ?? [],
    fabricType: body.fabricType,
    composition: body.composition,
    weave: body.weave,
    finish: body.finish,
    season: body.season,
    care: body.care,
    width: body.width,
    sellingMethod: body.sellingMethod ?? "fixed_cut",
    cutOptions,
    sizeOptions: body.sizeOptions ?? [],
    colourVariants: body.colourVariants ?? [],
    images: body.images ?? [],
    availability: body.availability ?? "in_stock",
    publishStatus: body.publishStatus ?? "published",
    stockQty: body.stockQty,
    lowStockThreshold: body.lowStockThreshold ?? 5,
    featured: Boolean(body.featured),
    newArrival: Boolean(body.newArrival),
    bestSeller: Boolean(body.bestSeller),
    includesNote: body.includesNote,
    updatedAt: new Date().toISOString(),
  };

  await updateStore((draft) => {
    draft.products.unshift(product);
  });

  revalidateStorefront([`/products/${product.slug}`]);

  return NextResponse.json({ product }, { status: 201 });
}
