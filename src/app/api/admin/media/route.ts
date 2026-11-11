import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore, updateStore } from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import type { MediaAsset } from "@/lib/store/types";

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ media: readStore().media });
}

export async function POST(request: Request) {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const form = await request.formData();
  const file = form.get("file");
  const alt = String(form.get("alt") ?? "Upload");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: "File required." }, { status: 400 });
  }
  if (file.size > 8 * 1024 * 1024) {
    return NextResponse.json(
      { error: "Max file size is 8MB." },
      { status: 400 },
    );
  }

  const ext = path.extname(file.name || "").toLowerCase() || ".jpg";
  const allowed = [".jpg", ".jpeg", ".png", ".webp", ".gif"];
  if (!allowed.includes(ext)) {
    return NextResponse.json(
      { error: "Use JPG, PNG, WEBP, or GIF." },
      { status: 400 },
    );
  }

  const id = newId("media");
  const filename = `${id}${ext}`;
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, filename), buffer);

  const asset: MediaAsset = {
    id,
    src: `/uploads/${filename}`,
    alt: alt.trim() || file.name,
    createdAt: new Date().toISOString(),
    kind: "hero",
  };

  await updateStore((draft) => {
    draft.media.unshift(asset);
  });

  return NextResponse.json({ media: asset }, { status: 201 });
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
    draft.media = draft.media.filter((m) => m.id !== id);
  });
  return NextResponse.json({ ok: true });
}
