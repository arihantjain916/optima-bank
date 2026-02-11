import prisma from "@/lib/prisma";
import { headers } from "next/headers";
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
    const headerList = headers();
    const userId = headerList.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ data: "Invalid User" }, { status: 500 });
    }

    const cardInfo = await prisma.card.findMany({
      where: {
        userId: userId,
      },
      select: {
        card_holder_name: true,
        expiry_year: true,
        expiry_month: true,
        last4: true,
        card_type: true,
        created_at: true,
        network: true,
        status: true,
      },
    });

    return NextResponse.json(
      { data: cardInfo, message: "Success" },
      { status: 200 },
    );
  } catch (e) {
    return NextResponse.json(
      { data: "Internal Server Error" },
      { status: 500 },
    );
  }
}
