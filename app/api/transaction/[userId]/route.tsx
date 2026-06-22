import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { currentUserId, unauthorized } from "@/lib/current-user";

export async function GET(
  request: NextRequest,
  {
    params,
  }: {
    params: { userId: string };
  }
) {
  try {
    const userId = currentUserId();
    if (!userId) return unauthorized();
    const user = await prisma.user.findUnique({ where: { id: userId }, select: { account_no: true } });
    if (!user?.account_no) return NextResponse.json({ error: "User not found" }, { status: 404 });
    const accountNumber = user.account_no;
    const result = await prisma.transaction.findMany({
      where: {
        OR: [
          {
            sender_acc_no: accountNumber,
          },
          {
            receiver_acc_no: accountNumber,
          },
        ],
      },
      orderBy: {
        transfer_date: "desc",
      },
    });

    const formattedTransactions = result
      .map((transaction) => {
        if (transaction.sender_acc_no === accountNumber) {
          if (transaction.method === "CREDIT") return null;
          return {
            date: transaction.transfer_date,
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            acc_no: transaction.receiver_acc_no,
            method: "DEBIT",
          };
        } else if (transaction.receiver_acc_no === accountNumber) {
          if (transaction.method === "DEBIT") return null;
          return {
            date: transaction.transfer_date,
            id: transaction.id,
            amount: transaction.amount,
            type: transaction.type,
            acc_no: transaction.sender_acc_no,
            method: "CREDIT",
          };
        }
        return null;
      })
      .filter((tx) => tx !== null);

    return NextResponse.json({
      message: "Transaction",
      data: formattedTransactions,
    });
  } catch (err: any) {
    return NextResponse.json({ data: err.message }, { status: 500 });
  }
}
