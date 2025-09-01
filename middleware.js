import { NextResponse } from "next/server";
import { verifyJwt } from "@/lib/auth";

export async function middleware(request) {
  const { pathname } = request.nextUrl;

  // Check if the route needs protection
  const isProtectedRoute =
    pathname.startsWith("/admin") ||
    pathname.startsWith("/teacher") ||
    pathname.startsWith("/teacher-dashboard");

  if (!isProtectedRoute) {
    return NextResponse.next();
  }

  try {
    // Get token from cookie
    const token = request.cookies.get("authToken")?.value;

    if (!token) {
      console.log("No auth token found, redirecting to login");
      return NextResponse.redirect(new URL("/teacher-login", request.url));
    }

    // Verify JWT token
    const decoded = verifyJwt(token);

    if (!decoded) {
      console.log("Invalid token, redirecting to login");
      return NextResponse.redirect(new URL("/teacher-login", request.url));
    }

    // Check if user has required role (TEACHER or ADMIN)
    if (decoded.role !== "TEACHER" && decoded.role !== "ADMIN") {
      console.log("Insufficient permissions, redirecting to login");
      return NextResponse.redirect(new URL("/teacher-login", request.url));
    }

    // User is authenticated and authorized, proceed
    console.log(
      `User ${decoded.userId} (${decoded.role}) accessing ${pathname}`
    );
    return NextResponse.next();
  } catch (error) {
    console.error("Middleware error:", error);
    return NextResponse.redirect(new URL("/teacher-login", request.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/teacher/:path*",
    "/teacher-dashboard/:path*",
    "/teacher-dashboard",
  ],
};
