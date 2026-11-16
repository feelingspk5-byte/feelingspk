import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import { newId, slugify } from "@/lib/store/ids";
import type { Collection } from "@/lib/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureStore();
  return NextResponse.json({ collections: readStore().collections });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Partial<Collection>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name is required." }, { status: 400 });
  }

  const id = newId("col");
  const store = readStore();
  let slug = slugify(body.slug || body.name) || id;
  let n = 2;
  while (store.collections.some((c) => c.slug === slug)) {
    slug = `${slugify(body.name)}-${n++}`;
  }

  const collection: Collection = {
    id,
    slug,
    name: body.name.trim(),
    description: body.description?.trim() || undefined,
    category: body.category ?? "unstitched_fabric",
    imageSrc: body.imageSrc || undefined,
    sortOrder: body.sortOrder ?? store.collections.length + 1,
  };

  await updateStore((draft) => {
    draft.collections.push(collection);
  });
  revalidateStorefront([`/collections/${collection.slug}`]);

  return NextResponse.json({ collection }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = (await request.json()) as Collection;
  if (!body.id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  await updateStore((draft) => {
    const idx = draft.collections.findIndex((c) => c.id === body.id);
    if (idx >= 0) {
      draft.collections[idx] = {
        ...draft.collections[idx],
        ...body,
        name: body.name.trim(),
        slug: slugify(body.slug || body.name),
      };
    }
  });
  revalidateStorefront([`/collections/${slugify(body.slug || body.name)}`]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");
  if (!id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }
  await updateStore((draft) => {
    draft.collections = draft.collections.filter((c) => c.id !== id);
  });
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
