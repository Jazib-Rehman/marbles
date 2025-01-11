import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode("123qwsaqw2frWE");

export async function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Redirect to login if no token
  if (!token) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  try {
    // Verify the token using jose
    const { payload } = await jwtVerify(token, JWT_SECRET);

    // Check user role and redirect if unauthorized
    const url = req.nextUrl.pathname;
    if (payload.role === "admin" && !url.startsWith("/admin")) {
      return NextResponse.redirect(new URL("/admin", req.url));
    }

    if (payload.role === "agency" && !url.startsWith("/agency")) {
      return NextResponse.redirect(new URL("/agency", req.url));
    }

    if (payload.role === "team" && !url.startsWith("/team")) {
      return NextResponse.redirect(new URL("/team", req.url));
    }

    return NextResponse.next(); // Allow access if authenticated
  } catch (err) {
    console.error("Token verification failed:", err);
    return NextResponse.redirect(new URL("/", req.url));
  }
}

export const config = {
  matcher: [
    "/admin/:path*",
    "/agency/:path*",
    "/team/:path*",
    "/admin-dashboard",
    "/agency-dashboard",
    "/team-dashboard",
  ],
};
