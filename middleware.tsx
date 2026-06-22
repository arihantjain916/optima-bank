import { NextRequest, NextResponse } from "next/server";
import { JwtType } from "./types/jwtPayload";

type SessionPayload = JwtType & { scope?: string; exp?: number };

function decodeBase64Url(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Uint8Array.from(atob(padded), (character) => character.charCodeAt(0));
}

/** Verifies the HS256 JWT with Web Crypto, which is supported in middleware's
 * Edge runtime. Node's jsonwebtoken package is only used inside API routes. */
async function verifySessionToken(token: string): Promise<SessionPayload> {
  const [encodedHeader, encodedPayload, encodedSignature, ...extra] = token.split(".");
  if (!encodedHeader || !encodedPayload || !encodedSignature || extra.length) {
    throw new Error("Malformed token");
  }

  const decoder = new TextDecoder();
  const header = JSON.parse(decoder.decode(decodeBase64Url(encodedHeader)));
  const payload = JSON.parse(
    decoder.decode(decodeBase64Url(encodedPayload)),
  ) as SessionPayload;
  if (header.alg !== "HS256" || !payload.data || (payload.exp && payload.exp * 1000 <= Date.now())) {
    throw new Error("Invalid token");
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT secret is not configured");
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["verify"],
  );
  const valid = await crypto.subtle.verify(
    "HMAC",
    key,
    decodeBase64Url(encodedSignature),
    new TextEncoder().encode(`${encodedHeader}.${encodedPayload}`),
  );
  if (!valid) throw new Error("Invalid token");
  return payload;
}

export async function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isApi = path.startsWith("/api");
  const isPublic =
    path === "/auth/login" ||
    path === "/auth/register" ||
    path === "/api/auth/login" ||
    path === "/api/auth/register";

  // Web client sends the JWT in the authCookie; the RN app sends it as
  // `Authorization: Bearer <token>`. Accept either.
  const authHeader = request.headers.get("authorization");
  const bearerToken = authHeader?.startsWith("Bearer ")
    ? authHeader.slice("Bearer ".length)
    : undefined;
  const sessionToken = request.cookies.get("authCookie")?.value;
  const mfaToken = request.cookies.get("mfaCookie")?.value;
  const isMfaRoute = path === "/auth/verify" || path.startsWith("/api/mfa");
  const token = isMfaRoute
    ? mfaToken ?? sessionToken ?? bearerToken
    : sessionToken ?? mfaToken ?? bearerToken;

  // logged-in user trying to access login/register (web pages only)
  // protected route without token
  if (!token && !isPublic) {
    // API clients can't follow an HTML redirect — give them a clean 401.
    if (isApi) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.redirect(new URL("/auth/login", request.url));
  }

  if (token) {
    try {
      const decoded = await verifySessionToken(token.toString());
      if (!decoded?.data) throw new Error("Malformed token");

      // A valid session can bypass login/register. A pre-auth MFA token must
      // instead remain able to access the verification screen.
      if (isPublic && decoded.scope !== "mfa" && !isApi) {
        return NextResponse.redirect(new URL("/dashboard", request.url));
      }

      // A pre-auth token (issued at login, before OTP) may ONLY reach the MFA
      // endpoints. Anything else requires the real session token.
      if (
        decoded.scope === "mfa" &&
        !path.startsWith("/api/mfa") &&
        path !== "/auth/verify"
      ) {
        if (isApi) {
          return NextResponse.json(
            { error: "OTP verification required" },
            { status: 401 },
          );
        }
        return NextResponse.redirect(new URL("/auth/login", request.url));
      }

      const headers = new Headers(request.headers);
      headers.set("x-user-id", decoded.data.id);
      headers.set("x-user-email", decoded.data.email);

      return NextResponse.next({
        request: { headers },
      });
    } catch (err) {
      if (isApi) {
        return NextResponse.json({ error: "Invalid token" }, { status: 401 });
      }
      const res = NextResponse.redirect(new URL("/auth/login", request.url));
      res.cookies.delete("authCookie");
      res.cookies.delete("mfaCookie");
      return res;
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/auth/verify",
    "/auth/login",
    "/auth/register",
    "/api/:path*",
  ],
};
