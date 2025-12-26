import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const pathname = req.nextUrl.pathname;
  console.log("[middleware] request pathname:", pathname);
  if (pathname === "/") {
    return NextResponse.redirect(new URL("/shop", req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ["/"],
};
