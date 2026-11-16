import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/** Send /collections/[slug] to the product page (skip the extra shade grid). */
export function middleware(request: NextRequest) {
  const match = request.nextUrl.pathname.match(/^\/collections\/([^/]+)\/?$/);
  if (!match?.[1]) return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/products/${match[1]}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/collections/:slug"],
};
