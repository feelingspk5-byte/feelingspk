import { NextResponse } from "next/server";
import { pushAudit } from "@/lib/store/audit";
import { getAdminSession } from "@/lib/store/admin-auth";
import { ensureStore, readStore, updateStore } from "@/lib/store/file-store";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import { newId } from "@/lib/store/ids";
import type { ShippingZone } from "@/lib/store/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  await ensureStore();
  return NextResponse.json({ zones: readStore().shippingZones });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as Partial<ShippingZone>;
  if (!body.name?.trim()) {
    return NextResponse.json({ error: "Name required." }, { status: 400 });
  }
  const cities = (body.cities ?? [])
    .map((c) => c.trim().toLowerCase())
    .filter(Boolean);
  const zone: ShippingZone = {
    id: newId("zone"),
    name: body.name.trim(),
    cities: cities.length ? cities : ["*"],
    rate: Number(body.rate) || 0,
    freeAbove: body.freeAbove,
    active: body.active !== false,
  };
  await updateStore((draft) => {
    draft.shippingZones.push(zone);
    pushAudit(draft, session.email, "shipping.create", zone.name);
  });
  revalidateStorefront(["/shipping"]);
  return NextResponse.json({ zone }, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const body = (await request.json()) as ShippingZone;
  await updateStore((draft) => {
    const idx = draft.shippingZones.findIndex((z) => z.id === body.id);
    if (idx >= 0) {
      draft.shippingZones[idx] = {
        ...body,
        cities: body.cities.map((c) => c.trim().toLowerCase()),
      };
      pushAudit(draft, session.email, "shipping.update", body.name);
    }
  });
  revalidateStorefront(["/shipping"]);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request: Request) {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const id = new URL(request.url).searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id." }, { status: 400 });
  await updateStore((draft) => {
    const zone = draft.shippingZones.find((z) => z.id === id);
    draft.shippingZones = draft.shippingZones.filter((z) => z.id !== id);
    pushAudit(draft, session.email, "shipping.delete", zone?.name);
  });
  revalidateStorefront(["/shipping"]);
  return NextResponse.json({ ok: true });
}
