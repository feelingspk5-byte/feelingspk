import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

/**
 * Skip the old collection detail shade grid — send visitors straight to the
 * product page where shades are chosen.
 */
export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const match = pathname.match(/^\/collections\/([^/]+)\/?$/);
  if (!match) return NextResponse.next();

  const slug = match[1];
  if (!slug || slug === "page") return NextResponse.next();

  const url = request.nextUrl.clone();
  url.pathname = `/products/${slug}`;
  return NextResponse.redirect(url);
}

export const config = {
  matcher: ["/collections/:slug"],
};
