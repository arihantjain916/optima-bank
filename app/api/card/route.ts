import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
  } catch (e) {
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = request.nextUrl.searchParams.get("userId");
    if (!userId) {
      return NextResponse.json({ data: "Invalid User" }, { status: 500 });
    }
  } catch (e) {
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 },
    );
  }
}
