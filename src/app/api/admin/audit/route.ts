import { NextResponse } from "next/server";
import { getAdminSession } from "@/lib/store/admin-auth";
import { readStore } from "@/lib/store/file-store";

export async function GET() {
  const session = await getAdminSession();
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  return NextResponse.json({ auditLog: readStore().auditLog });
}
