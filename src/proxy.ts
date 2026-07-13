import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getSession } from "./lib/session";

const protectedRoutes = ["/dashboard"];
const publicRoutes = ["/login"];

const ADMIN_ONLY_ROUTES = [
  '/dashboard/projects',
  '/dashboard/employees',
  '/dashboard/attendance',
  '/dashboard/reports',
  '/dashboard/settings/roles'
];

export async function proxy(req: NextRequest) {
  const path = req.nextUrl.pathname;
  
  // Quick check for protected vs public routes prefix
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  const isPublic = publicRoutes.some((route) => path.startsWith(route));

  if (!isProtected && !isPublic) {
    // If accessing root "/", redirect to dashboard
    if (path === "/") {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
    return NextResponse.next();
  }

  const session = await getSession();

  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", req.nextUrl));
  }

  if (isPublic && session) {
    return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
  }

  if (isProtected && session) {
    // Admin route protection
    const isAdminOnly = ADMIN_ONLY_ROUTES.some(route => path === route || path.startsWith(`${route}/`));
    if (isAdminOnly && session?.user?.role !== 'ADMIN') {
      return NextResponse.redirect(new URL("/dashboard", req.nextUrl));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
