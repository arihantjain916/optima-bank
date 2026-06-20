import { cookies } from "next/headers";
import jwt from "jsonwebtoken";

export async function generateToken(email: string, id: string) {
  const token = await jwt.sign(
    {
      data: {
        email,
        id,
      },
    },
    process.env.JWT_SECRET!,
  );

  cookies().set({
    name: "authCookie",
    value: token,
    // httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
  });

  // Also return the token so non-browser clients (the RN app) can store it
  // and send it as `Authorization: Bearer <token>`.
  return token;
}

// Short-lived credential issued at login *before* OTP. It only authorizes the
// MFA step (scope: "mfa") and is NOT a session — no cookie is set. The real
// session JWT is minted by generateToken() after the OTP is verified.
export async function generatePreAuthToken(email: string, id: string) {
  return jwt.sign(
    {
      data: { email, id },
      scope: "mfa",
    },
    process.env.JWT_SECRET!,
    { expiresIn: "10m" },
  );
}

export async function deleteToken() {
  cookies().delete("authCookie");
  return true;
}
