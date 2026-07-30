import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Bảo vệ /admin
  if (pathname.startsWith("/admin")) {
    const token = request.cookies.get("access_token")?.value;
    if (!token) {
      const loginUrl = new URL("/login", request.url);
      loginUrl.searchParams.set("from", pathname);
      return NextResponse.redirect(loginUrl);
    }
    return NextResponse.next();
  }

  // Đã login thì không vào /login
  if (pathname === "/login" || pathname === "/register") {
    const token = request.cookies.get("access_token")?.value;
    if (token) {
      const from = request.nextUrl.searchParams.get("from");
      return NextResponse.redirect(new URL(from || "/", request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/login", "/register"],
};
