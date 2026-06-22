import { headers } from "next/headers";
import { NextResponse } from "next/server";

/** Identity set by middleware only after JWT signature and expiry verification. */
export function currentUserId() {
  return headers().get("x-user-id");
}

export function unauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}
