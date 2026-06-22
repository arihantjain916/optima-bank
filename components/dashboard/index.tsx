"use client";

import { DashboardApi, TransactionApi } from "@/helper/api";
import { useState, useEffect } from "react";
import { DashboardType } from "@/types/userType";
import { DashboardCard, RecentTransaction } from "./component";
import { Overview } from "./component/overview";
import { TransactionType } from "@/types/transactionType";
export function Dashboard(props: { email?: string }) {
  const [userdata, setUserData] = useState<DashboardType>();
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]);
  useEffect(() => {
    async function initialize() {
      const dashboard = await DashboardApi("me");
      if (dashboard?.status !== 200) return;

      const user = dashboard.data.data;
      setUserData(user);
      if (!user?.account_no) return;

      const transactions = await TransactionApi("me");
      if (transactions?.status === 200) {
        setTransactionData(transactions.data.data);
      }
    }
    void initialize();
  }, []);

  return (
    <div className="flex min-h-screen w-full flex-col">
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <DashboardCard userdata={userdata!} />
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
          <RecentTransaction
            transactionData={transactionData}
            userdata={userdata!}
          />
          <Overview transactionData={transactionData} />
        </div>
      </main>
    </div>
  );
}
