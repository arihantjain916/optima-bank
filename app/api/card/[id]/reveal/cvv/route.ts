import { decrypt, generateDynamicCVV } from "@/helper/encrypt";
import prisma from "@/lib/prisma";
import { headers } from "next/headers";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } },
) {
  try {
    const headerList = headers();
    const userId = headerList.get("x-user-id");

    if (!userId) {
      return NextResponse.json({ data: "Invalid User" }, { status: 500 });
    }
    const isCardExist = await prisma.card.findUnique({
      where: {
        id: params.id,
        userId: userId,
      },
      select: {
        id: true,
        card_number_encrypted: true,
        encryptInfo: {
          select: {
            tag: true,
            iv: true,
          },
        },
      },
    });

    if (!isCardExist) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    const generateCVV = generateDynamicCVV(
      isCardExist.id,
      process.env.CVV_TOKEN as string,
    );

    if (!generateCVV) {
      return NextResponse.json({ error: "Card not found" }, { status: 404 });
    }

    return NextResponse.json(
      { data: generateCVV, message: "Success" },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 500 });
  }
}
