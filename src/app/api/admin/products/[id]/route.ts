import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import { slugify } from "@/lib/store/ids";
import type { Product } from "@/lib/types";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const product = readStore().products.find((p) => p.id === id);
  if (!product) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json({ product });
}

export async function PUT(request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  const body = (await request.json()) as Partial<Product>;
  const existing = readStore().products.find((p) => p.id === id);
  if (!existing) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  let slug = body.slug ? slugify(body.slug) : existing.slug;
  const others = readStore().products.filter((p) => p.id !== id);
  if (others.some((p) => p.slug === slug)) {
    slug = `${slug}-${id.slice(-4)}`;
  }

  const product: Product = {
    ...existing,
    ...body,
    id: existing.id,
    slug,
    name: (body.name ?? existing.name).trim(),
    collectionSlugs: body.collectionSlugs ?? existing.collectionSlugs,
    colourVariants: body.colourVariants ?? existing.colourVariants,
    cutOptions: body.cutOptions ?? existing.cutOptions,
    sizeOptions: body.sizeOptions ?? existing.sizeOptions,
    images: body.images ?? existing.images,
    updatedAt: new Date().toISOString(),
  };

  await updateStore((draft) => {
    const idx = draft.products.findIndex((p) => p.id === id);
    if (idx >= 0) draft.products[idx] = product;
  });

  return NextResponse.json({ product });
}

export async function DELETE(_request: Request, ctx: Ctx) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { id } = await ctx.params;
  await updateStore((draft) => {
    draft.products = draft.products.filter((p) => p.id !== id);
  });
  return NextResponse.json({ ok: true });
}
