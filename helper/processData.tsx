import { AggregatedDataType } from "@/types/formatData";
import { TransactionType } from "@/types/transactionType";

type DataMap = Record<string, AggregatedDataType>;

export async function processData(
  transactions: TransactionType[]
): Promise<AggregatedDataType[]> {
  const dataMap: DataMap = {};

  transactions.forEach((transaction) => {
    const { date, method, amount } = transaction;

    // Ensure amount is a valid number
    if (typeof amount !== "number" || isNaN(amount)) {
      console.warn(`Invalid amount value: ${amount}`);
      return;
    }

    const dateString = new Date(date).toISOString().split("T")[0];

    if (!dataMap[dateString]) {
      dataMap[dateString] = { date: dateString, CREDIT: 0, DEBIT: 0 };
    }

    if (method === "CREDIT" || method === "DEBIT") {
      dataMap[dateString][method] += amount;
    } else {
      console.warn(`Unknown transaction method: ${method}`);
    }
  });

  const data = Object.values(dataMap);

  return data;
}
