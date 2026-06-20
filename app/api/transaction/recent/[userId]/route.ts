import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTransactions } from "@/lib/transaction";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sender_acc_no: params.userId },
          { receiver_acc_no: params.userId },
        ],
      },
      orderBy: { transfer_date: "desc" },
      take: 5,
    });

    return NextResponse.json({
      message: "Recent transactions",
      data: formatTransactions(transactions, params.userId),
    });
  } catch (error) {
    console.error("Unable to get recent transactions:", error);
    return NextResponse.json(
      { error: "Unable to get recent transactions" },
      { status: 500 },
    );
  }
}
