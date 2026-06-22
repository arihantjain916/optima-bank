import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import {
  formatTransactions,
  getPeriodStart,
  resolveAccountNumber,
  TransactionPeriod,
} from "@/lib/transaction";
import { currentUserId, unauthorized } from "@/lib/current-user";

const validPeriods = new Set<TransactionPeriod>(["week", "month", "year"]);

export async function GET(
  request: NextRequest,
  { params }: { params: { userId: string } },
) {
  const period = request.nextUrl.searchParams.get("period");

  if (period && !validPeriods.has(period as TransactionPeriod)) {
    return NextResponse.json(
      { error: "period must be one of: week, month, year" },
      { status: 400 },
    );
  }


  try {
    const userId = currentUserId();
    if (!userId) return unauthorized();
    const accountNumber = await resolveAccountNumber(userId);
    if (!accountNumber) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const transactions = await prisma.transaction.findMany({
      where: {
        OR: [
          { sender_acc_no: accountNumber },
          { receiver_acc_no: accountNumber },
        ],
        ...(period
          ? {
              transfer_date: {
                gte: getPeriodStart(period as TransactionPeriod),
              },
            }
          : {}),
      },
      orderBy: { transfer_date: "desc" },
    });

    return NextResponse.json({
      message: "Transaction history",
      period: period ?? "all",
      data: formatTransactions(transactions, accountNumber),
    });
  } catch (error) {
    console.error("Unable to get transaction history:", error);
    return NextResponse.json(
      { error: "Unable to get transaction history" },
      { status: 500 },
    );
  }
}
