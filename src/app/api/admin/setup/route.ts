import { NextResponse } from "next/server";
import {
  adminIsConfigured,
  createAdminSession,
  setAdminPassword,
} from "@/lib/store/admin-auth";

export async function POST(request: Request) {
  if (adminIsConfigured()) {
    return NextResponse.json(
      { error: "Admin already configured." },
      { status: 400 },
    );
  }

  const body = (await request.json()) as { password?: string };
  try {
    await setAdminPassword(body.password ?? "");
    await createAdminSession();
    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error ? error.message : "Could not set password.",
      },
      { status: 400 },
    );
  }
}
