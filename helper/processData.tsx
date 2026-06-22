import { AggregatedDataType } from "@/types/formatData";
import { TransactionType } from "@/types/transactionType";

type DataMap = Record<string, AggregatedDataType>;

export function processData(
  transactions: TransactionType[],
): AggregatedDataType[] {
  const dataMap: DataMap = {};

  transactions.forEach((transaction) => {
    const { date, method, amount } = transaction;

    // Ensure amount is a valid number
    if (typeof amount !== "number" || isNaN(amount)) {
      console.warn(`Invalid amount value: ${amount}`);
      return;
    }

    const parsedDate = new Date(date);
    if (Number.isNaN(parsedDate.getTime())) {
      console.warn(`Invalid transaction date: ${date}`);
      return;
    }

    const dateString = parsedDate.toISOString().split("T")[0];

    if (!dataMap[dateString]) {
      dataMap[dateString] = { date: dateString, CREDIT: 0, DEBIT: 0 };
    }

    if (method === "CREDIT" || method === "DEBIT") {
      dataMap[dateString][method] += amount;
    } else {
      console.warn(`Unknown transaction method: ${method}`);
    }
  });

  return Object.values(dataMap).sort((a, b) => a.date.localeCompare(b.date));
}
