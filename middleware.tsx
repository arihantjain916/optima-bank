import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { JwtType } from "./types/jwtPayload";

// export async function middleware(request: NextRequest) {
//   const Path = request.nextUrl.pathname;
//   const PublicPath = Path === "/auth/login" || Path === "/auth/register";

//   const token = request.cookies.get("authCookie");

//   if (PublicPath && token) {
//     return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
//   }

//   if (!token && !PublicPath) {
//     return NextResponse.redirect(new URL("/auth/login", request.url));
//   }

//   console.log("token12", token);
//   if (token) {
//     try {
//       const secret = process.env.JWT_SECRET!;
//       const { data } = jwt.verify(token!.value?.toString(), secret) as JwtType;
//       const arihant = jwt.verify(token!.toString(), secret);

//       console.log("data", data);
//       console.log("data", arihant);
//       // attach user info to headers
//       const requestHeaders = new Headers(request.headers);
//       requestHeaders.set("x-user-id", data.id);
//       requestHeaders.set("x-user-email", data.email);

//       return NextResponse.next({
//         request: {
//           headers: requestHeaders,
//         },
//       });
//     } catch (err) {
//       // invalid token → logout
//       const res = NextResponse.redirect(new URL("/auth/login", request.url));
//       res.cookies.delete("authCookie");
//       return res;
//     }
//   }
// }

// export const config = {
//   matcher: ["/dashboard/:path*", "/dashboard", "/auth/login", "/auth/register"],
// };

// import { NextRequest, NextResponse } from "next/server";
// import { jwtVerify } from "jose";
// import { JwtType } from "./types/jwtPayload";

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isPublic = path === "/auth/login" || path === "/auth/register";

  const token = request.cookies.get("authCookie")?.value;

  // logged-in user trying to access login/register
  if (isPublic && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // protected route without token
  if (!token && !isPublic) {
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  console.log("token", token);
  if (token) {
    try {
      const secret = process.env.JWT_SECRET as string;

      const { data } = jwt.verify(token.toString(), secret) as JwtType;
      const arihant = jwt.verify(token!.toString(), secret);

      console.log("user:", data);

      // attach user to headers
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
  matcher: ["/dashboard/:path*", "/auth/login", "/auth/register"],
};
