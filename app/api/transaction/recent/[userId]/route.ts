import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { formatTransactions, resolveAccountNumber } from "@/lib/transaction";

export async function GET(
  _request: Request,
  { params }: { params: { userId: string } },
) {
  try {
    const accountNumber = await resolveAccountNumber(params.userId);
    if (!accountNumber) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sender_acc_no: accountNumber },
          { receiver_acc_no: accountNumber },
        ],
      },
      orderBy: { transfer_date: "desc" },
      take: 5,
    });

    return NextResponse.json({
      message: "Recent transactions",
      data: formatTransactions(transactions, accountNumber),
    });
  } catch (error) {
    console.error("Unable to get recent transactions:", error);
    return NextResponse.json(
      { error: "Unable to get recent transactions" },
      { status: 500 },
    );
  }
}
