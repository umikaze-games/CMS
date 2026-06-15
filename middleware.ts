import { NextRequest, NextResponse } from "next/server";
import { ADMIN_SESSION_COOKIE, verifyAdminSessionToken } from "@/lib/admin-auth";

const adminLoginPath = "/admin/login";
const adminAuthApiPrefix = "/api/admin/auth/";

export async function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const isAdminPath = pathname.startsWith("/admin");
  const isAdminApiPath = pathname.startsWith("/api/admin");

  if (!isAdminPath && !isAdminApiPath) {
    return NextResponse.next();
  }

  if (pathname.startsWith(adminAuthApiPrefix)) {
    return NextResponse.next();
  }

  const isAuthenticated = await verifyAdminSessionToken(
    request.cookies.get(ADMIN_SESSION_COOKIE)?.value,
    { secret: process.env.ADMIN_SESSION_SECRET }
  );

  if (pathname === adminLoginPath) {
    if (!isAuthenticated) {
      return NextResponse.next();
    }

    return NextResponse.redirect(new URL("/admin/notices", request.url));
  }

  if (pathname === "/admin" || pathname === "/admin/") {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL("/admin/notices", request.url));
    }

    const loginUrl = new URL(adminLoginPath, request.url);
    loginUrl.searchParams.set("next", "/admin/notices");
    return NextResponse.redirect(loginUrl);
  }

  if (isAuthenticated) {
    return NextResponse.next();
  }

  if (isAdminApiPath) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const loginUrl = new URL(adminLoginPath, request.url);
  loginUrl.searchParams.set("next", `${pathname}${search}`);

  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ["/admin/:path*", "/api/admin/:path*"]
};
