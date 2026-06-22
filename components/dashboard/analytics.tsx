"use client";

import { DashboardApi, TransactionApi } from "@/helper/api";
import { TransactionType } from "@/types/transactionType";
import { useState, useEffect } from "react";
import { Overview } from "./component/overview";

export default function AnalyticsPage() {
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]);

  useEffect(() => {
    async function initialize() {
      const dashboard = await DashboardApi("me");
      if (dashboard?.status !== 200) return;

      const accountNumber = dashboard.data.data?.account_no;
      if (!accountNumber) return;

      const transactions = await TransactionApi("me");
      if (transactions?.status === 200) {
        setTransactionData(transactions.data.data);
      }
    }
    void initialize();
  }, []);

  return (
    <main>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 p-4">
        {transactionData && <Overview transactionData={transactionData} />}
      </div>
    </main>
  );
}
