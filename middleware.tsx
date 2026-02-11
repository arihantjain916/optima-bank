import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtType } from "./types/jwtPayload";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/api/auth/login" ||
    path === "/api/auth/register";
  const token = request.cookies.get("authCookie")?.value;

  // logged-in user trying to access login/register
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // protected route without token
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    try {
      const { data } = jwt.decode(token.toString()) as JwtType;

      const headers = new Headers(request.headers);
      headers.set("x-user-id", data.id);
      headers.set("x-user-email", data.email);

      return NextResponse.next({
        request: { headers },
      });
    } catch (err) {
      const res = NextResponse.redirect(new URL("/auth/login", request.url));
      res.cookies.delete("authCookie");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/login",
    "/auth/register",
    "/api/:path*",
  ],
};
