import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import type { Offer } from "@/lib/store/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ offers: readStore().offers });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = (await request.json()) as Partial<Offer>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name required." }, { status: 400 });
  }

  const offer: Offer = {
    id: newId("offer"),
    name: body.name.trim(),
    type: body.type ?? "percent",
    value: Number(body.value) || 0,
    code: body.code?.trim().toUpperCase() || undefined,
    badgeText: body.badgeText?.trim() || undefined,
    active: body.active !== false,
    startsAt: body.startsAt || undefined,
    endsAt: body.endsAt || undefined,
    minOrder: body.minOrder,
    usageLimit: body.usageLimit,
    usedCount: 0,
    collectionSlugs: body.collectionSlugs ?? [],
    productIds: body.productIds ?? [],
    createdAt: new Date().toISOString(),
  };

  await updateStore((draft) => {
    draft.offers.unshift(offer);
    pushAudit(draft, session.email, "offer.create", offer.name);
  });

  return NextResponse.json({ offer }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Offer;
  if (!body.id) {
    return NextResponse.json({ error: "Missing id." }, { status: 400 });
  }

  await updateStore((draft) => {
    const idx = draft.offers.findIndex((o) => o.id === body.id);
    if (idx >= 0) {
      draft.offers[idx] = {
        ...draft.offers[idx],
        ...body,
        code: body.code?.trim().toUpperCase() || undefined,
      };
      pushAudit(draft, session.email, "offer.update", body.name);
    }
  });
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await updateStore((draft) => {
    const offer = draft.offers.find((o) => o.id === id);
    draft.offers = draft.offers.filter((o) => o.id !== id);
    pushAudit(draft, session.email, "offer.delete", offer?.name);
  });
  return NextResponse.json({ ok: true });
}
