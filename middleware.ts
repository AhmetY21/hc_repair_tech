import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/giris", "/api/pdf", "/api/upload"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith("/_next") ||
    pathname.includes(".") ||
    PUBLIC_PATHS.some((path) => pathname.startsWith(path))
  ) {
    return NextResponse.next();
  }

  const hasSession = Boolean(request.cookies.get("hc-session")?.value);

  if (!hasSession && pathname !== "/giris") {
    return NextResponse.redirect(new URL("/giris", request.url));
  }

  if (hasSession && pathname === "/giris") {
    return NextResponse.redirect(new URL("/ana-sayfa", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!.*\\.).*)"],
};
