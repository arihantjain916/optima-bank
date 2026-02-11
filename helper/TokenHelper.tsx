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
}

export async function deleteToken() {
  cookies().delete("authCookie");
  return true;
}
