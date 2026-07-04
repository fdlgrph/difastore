import { NextResponse } from "next/server";

export function middleware(req) {
  const isAdminRoute = req.nextUrl.pathname.startsWith("/admin") &&
    req.nextUrl.pathname !== "/admin/login";
  const isAdminApi = req.nextUrl.pathname.startsWith("/api/admin/") &&
    !req.nextUrl.pathname.startsWith("/api/admin/login");

  if (isAdminRoute || isAdminApi) {
    const cookie = req.cookies.get("difa_admin")?.value;
    if (cookie !== process.env.ADMIN_PASSWORD) {
      if (isAdminApi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      return NextResponse.redirect(new URL("/admin/login", req.url));
    }
  }
  return NextResponse.next();
}

export const config = { matcher: ["/admin/:path*", "/api/admin/:path*"] };
