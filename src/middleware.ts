import { NextResponse } from "next/server";
import { auth } from "@/auth";

export default auth((req) => {
  const { pathname } = req.nextUrl;
  const session = req.auth;

  if (pathname.startsWith("/dashboard")) {
    if (!session?.user) {
      return NextResponse.redirect(new URL("/api/auth/signin", req.url));
    }

    if (
      pathname.startsWith("/dashboard/admin") &&
      session.user.role !== "ADMIN"
    ) {
      return NextResponse.redirect(new URL("/dashboard/posts", req.url));
    }
  }
});

export const config = {
  matcher: ["/dashboard/:path*"],
  runtime: "nodejs",
};
