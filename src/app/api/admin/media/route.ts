import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getAdminSession } from "@/lib/store/admin-auth";
import {
  ensureStore,
  getStoreBackend,
  readStore,
  updateStore,
} from "@/lib/store/file-store";
import { newId } from "@/lib/store/ids";
import { revalidateStorefront } from "@/lib/store/revalidate-storefront";
import type { MediaAsset } from "@/lib/store/types";

async function persistUpload(
  filename: string,
  buffer: Buffer,
  contentType: string,
): Promise<string> {
  // Prefer Vercel Blob when configured — survives serverless redeploys.
  if (process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    const { put } = await import("@vercel/blob");
    const result = await put(`feelings/media/${filename}`, buffer, {
      access: "public",
      addRandomSuffix: false,
      allowOverwrite: true,
      contentType,
      cacheControlMaxAge: 60 * 60 * 24 * 30,
    });
    return result.url;
  }

  // Next: Supabase Storage public bucket `media`.
  if (
    process.env.SUPABASE_URL?.trim() &&
    process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()
  ) {
    const { createClient } = await import("@supabase/supabase-js");
    const supabase = createClient(
      process.env.SUPABASE_URL.trim(),
      process.env.SUPABASE_SERVICE_ROLE_KEY.trim(),
      { auth: { persistSession: false, autoRefreshToken: false } },
    );

    await supabase.storage.createBucket("media", { public: true }).catch(() => {
      /* bucket may already exist */
    });

    const { error } = await supabase.storage
      .from("media")
      .upload(filename, buffer, {
        contentType,
        upsert: true,
      });
    if (!error) {
      const { data } = supabase.storage.from("media").getPublicUrl(filename);
      if (data?.publicUrl) return data.publicUrl;
    } else {
      console.error("[media] supabase upload failed", error.message);
    }
  }

  // Local / ephemeral fallback (dev, or when remote storage is unavailable).
  const dir = path.join(process.cwd(), "public", "uploads");
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, filename), buffer);
  return `/uploads/${filename}`;
}

export async function GET() {
  const session = await getAdminSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await ensureStore();
  return NextResponse.json({
    media: readStore().media,
    backend: getStoreBackend(),
  });
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
  const buffer = Buffer.from(await file.arrayBuffer());
  const contentType = file.type || "image/jpeg";
  const src = await persistUpload(filename, buffer, contentType);

  const asset: MediaAsset = {
    id,
    src,
    alt: alt.trim() || file.name,
    createdAt: new Date().toISOString(),
    kind: "hero",
  };

  await updateStore((draft) => {
    draft.media.unshift(asset);
  });
  revalidateStorefront();

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
  revalidateStorefront();
  return NextResponse.json({ ok: true });
}
