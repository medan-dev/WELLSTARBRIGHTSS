import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE_NAME = "ws_session_token";

const AUTH_SECRET_STRING =
  process.env.AUTH_SECRET ||
  process.env.NEXTAUTH_SECRET ||
  "edurexa-enterprise-multi-tenant-jwt-secret-key-2026";

const secretKey = new TextEncoder().encode(AUTH_SECRET_STRING);

interface DecodedToken {
  id: string;
  name: string;
  email: string;
  role: string;
}

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Retrieve session token from httpOnly cookie
  const token = req.cookies.get(SESSION_COOKIE_NAME)?.value;

  let session: DecodedToken | null = null;
  if (token) {
    try {
      const { payload } = await jwtVerify(token, secretKey);
      session = payload as unknown as DecodedToken;
    } catch {
      session = null;
    }
  }

  // 1. Guard Admin Dashboard routes
  if (pathname.startsWith("/admin/dashboard")) {
    const adminRoles = ["SUPER_ADMIN", "BURSAR", "CASHIER", "AUDITOR"];
    if (!session || !adminRoles.includes(session.role)) {
      const redirectUrl = new URL("/admin", req.url);
      redirectUrl.searchParams.set("from", pathname);
      redirectUrl.searchParams.set("error", "unauthorized");
      const res = NextResponse.redirect(redirectUrl);
      if (token && !session) {
        // Expired or invalid token, clean cookie
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }
  }

  // 2. Guard Teacher Dashboard routes
  if (pathname.startsWith("/teacher/dashboard")) {
    const teacherRoles = ["TEACHER", "SUPER_ADMIN"];
    if (!session || !teacherRoles.includes(session.role)) {
      const redirectUrl = new URL("/teacher", req.url);
      redirectUrl.searchParams.set("from", pathname);
      redirectUrl.searchParams.set("error", "unauthorized");
      const res = NextResponse.redirect(redirectUrl);
      if (token && !session) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }
  }

  // 3. Guard Student Dashboard routes
  if (pathname.startsWith("/student/dashboard")) {
    const studentRoles = ["STUDENT", "SUPER_ADMIN"];
    if (!session || !studentRoles.includes(session.role)) {
      const redirectUrl = new URL("/student", req.url);
      redirectUrl.searchParams.set("from", pathname);
      redirectUrl.searchParams.set("error", "unauthorized");
      const res = NextResponse.redirect(redirectUrl);
      if (token && !session) {
        res.cookies.delete(SESSION_COOKIE_NAME);
      }
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/admin/dashboard/:path*",
    "/teacher/dashboard/:path*",
    "/student/dashboard/:path*",
  ],
};
