import { Transaction, TransactionMethod } from "@prisma/client";
import prisma from "@/lib/prisma";

export type TransactionPeriod = "week" | "month" | "year";

/** Accepts either the Prisma user ID or the account number used by Transaction. */
export async function resolveAccountNumber(identifier: string) {
  const user = await prisma.user.findFirst({
    where: {
      OR: [{ id: identifier }, { account_no: identifier }],
    },
    select: { account_no: true },
  });

  return user?.account_no ?? null;
}

export function getPeriodStart(period: TransactionPeriod, now = new Date()) {
  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);

  if (period === "week") {
    const day = start.getUTCDay();
    const daysSinceMonday = day === 0 ? 6 : day - 1;
    start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  }

  if (period === "month") start.setUTCDate(1);
  if (period === "year") start.setUTCMonth(0, 1);

  return start;
}

export function formatTransactions(
  transactions: Transaction[],
  accountNumber: string,
) {
  return transactions
    .map((transaction) => {
      if (
        transaction.sender_acc_no === accountNumber &&
        transaction.method === TransactionMethod.DEBIT
      ) {
        return {
          date: transaction.transfer_date,
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.type,
          acc_no: transaction.receiver_acc_no,
          method: TransactionMethod.DEBIT,
        };
      }

      if (
        transaction.receiver_acc_no === accountNumber &&
        transaction.method === TransactionMethod.CREDIT
      ) {
        return {
          date: transaction.transfer_date,
          id: transaction.id,
          amount: transaction.amount,
          type: transaction.type,
          acc_no: transaction.sender_acc_no,
          method: TransactionMethod.CREDIT,
        };
      }

      return null;
    })
    .filter((transaction): transaction is NonNullable<typeof transaction> =>
      Boolean(transaction),
    );
}
