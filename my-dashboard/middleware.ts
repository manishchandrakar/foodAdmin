import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { verifyJwt, SESSION_COOKIE } from "@/lib/auth";

// Dashboard pages only admins can access (subadmins get redirected)
const ADMIN_ONLY_PATHS = [
  "/dashboard/payments",
  "/dashboard/reviews",
  "/dashboard/admins",
];

export const middleware = async (request: NextRequest) => {
  const { pathname } = request.nextUrl;

  // Resolve JWT from the session cookie (issued by the Express backend)
  const token = request.cookies.get(SESSION_COOKIE)?.value;
  const payload = token ? await verifyJwt(token) : null;

  // Login page: redirect already-authenticated users to dashboard
  if (pathname === "/login") {
    if (payload) return NextResponse.redirect(new URL("/dashboard", request.url));
    return NextResponse.next();
  }

  // Dashboard: require auth + enforce role restrictions
  if (pathname.startsWith("/dashboard")) {
    if (!payload) return NextResponse.redirect(new URL("/login", request.url));

    if (
      payload.role === "subAdmin" &&
      ADMIN_ONLY_PATHS.some((p) => pathname.startsWith(p))
    ) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }

    return NextResponse.next();
  }

  return NextResponse.next();
};

// API routes are now served by the Express backend — only protect page routes
export const config = {
  matcher: ["/dashboard/:path*", "/login"],
};
