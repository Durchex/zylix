import { NextResponse, type NextRequest } from "next/server";

const PROTECTED_PREFIXES = ["/account", "/seller", "/admin"];
const REFRESH_COOKIE_NAME = "zylix_rt";

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const isProtected = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix));

  if (!isProtected) {
    return NextResponse.next();
  }

  const hasSessionCookie = request.cookies.has(REFRESH_COOKIE_NAME);
  if (!hasSessionCookie) {
    const loginUrl = new URL("/auth/login", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/account/:path*", "/seller/:path*", "/admin/:path*"],
};
