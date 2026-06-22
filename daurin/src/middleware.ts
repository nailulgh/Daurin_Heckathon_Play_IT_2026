import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const path = req.nextUrl.pathname;

    // RBAC Logic
    if (path.startsWith("/rumah-tangga") && token?.role !== "RUMAH_TANGGA") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (path.startsWith("/pengepul") && token?.role !== "PENGEPUL") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
    if (path.startsWith("/industri") && token?.role !== "INDUSTRI") {
      return NextResponse.redirect(new URL("/auth/login", req.url));
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
  }
);

export const config = {
  matcher: ["/rumah-tangga/:path*", "/pengepul/:path*", "/industri/:path*"],
};
