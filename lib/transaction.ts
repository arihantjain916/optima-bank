import { Transaction, TransactionMethod } from "@prisma/client";

export type TransactionPeriod = "week" | "month" | "year";

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
