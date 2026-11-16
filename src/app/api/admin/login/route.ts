import { NextResponse } from "next/server";
import {
  adminIsConfigured,
  createAdminSession,
  verifyAdminPassword,
} from "@/lib/store/admin-auth";

export async function POST(request: Request) {
  if (!(await adminIsConfigured())) {
    return NextResponse.json(
      { error: "Admin not set up yet." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as { password?: string };
  const ok = await verifyAdminPassword(body.password ?? "");
  if (!ok) {
    return NextResponse.json(
      { error: "Incorrect password." },
      { status: 401 },
    );
  }

  await createAdminSession();
  return NextResponse.json({ ok: true });
}
