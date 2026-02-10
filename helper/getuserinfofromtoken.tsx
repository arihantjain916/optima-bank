import Cookies from "js-cookie";
import jwt from "jsonwebtoken";

export default function getUserInfo() {
  try {
    const authCookie = Cookies.get("authCookie");

    if (!authCookie) {
      return {
        error: "No auth cookie found",
      };
    }

    const secretKey = process.env.NEXT_PUBLIC_JWT_SECRET!;

    const decoded = jwt.verify(authCookie.toString(), secretKey);
    if (!decoded) {
      return {
        error: "Failed to decode token",
      };
    }
    return decoded;
  } catch (err) {
    if (err instanceof Error) {
      return {
        error: err.message,
      };
    } else {
      return {
        error: "An unknown error occurred",
      };
    }
  }
}
