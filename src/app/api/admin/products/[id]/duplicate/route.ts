import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { newId, slugify } from "@/lib/store/ids";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { Product } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(_request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await ensureStore();
  const source = readStore().products.find((p) => p.id === id);
  if (!source) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newProductId = newId("prod");
  let slug = slugify(`${source.slug}-copy`);
  let n = 2;
  const store = readStore();
  while (store.products.some((p) => p.slug === slug)) {
    slug = `${slugify(source.slug)}-copy-${n++}`;
  }

  const clone: Product = {
    ...structuredClone(source),
    id: newProductId,
    slug,
    name: `${source.name} (copy)`,
    sku: source.sku ? `${source.sku}-COPY` : undefined,
    publishStatus: "draft",
    featured: false,
    bestSeller: false,
    updatedAt: new Date().toISOString(),
    colourVariants: (source.colourVariants ?? []).map((c) => ({
      ...c,
      id: newId("colr"),
    })),
    images: (source.images ?? []).map((img) => ({
      ...img,
      id: newId("img"),
    })),
  };

  await updateStore((draft) => {
    draft.products.unshift(clone);
    pushAudit(draft, session.email, "product.duplicate", source.name);
  });
  revalidateStorefront([`/products/${clone.slug}`]);

  return NextResponse.json({ product: clone }, { status: 201 });
}
