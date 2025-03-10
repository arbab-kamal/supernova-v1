import { NextRequest, NextResponse } from "next/server";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Redirect `/` to `/auth`
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // Allow `/auth` to be public
  if (pathname.startsWith("/auth")) {
    return NextResponse.next();
  }
}

// Apply middleware to all routes except static files
export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
