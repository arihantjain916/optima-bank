"use client";

import { DashboardApi, TransactionApi } from "@/helper/api";
import getUserInfo from "@/helper/getuserinfofromtoken";
import { JwtType } from "@/types/jwtPayload";
import { TransactionType } from "@/types/transactionType";
import { useState, useEffect } from "react";
import { Overview } from "./component/overview";
import { checkIsLogin } from "@/helper/checkAuth";

export default function AnalyticsPage() {
  const isLogin = checkIsLogin();
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]);

  useEffect(() => {
    async function initialize() {
      const token = getUserInfo() as JwtType;
      const id = token?.data?.id;
      if (!id) return;

      const dashboard = await DashboardApi(id);
      if (dashboard?.status !== 200) return;

      const accountNumber = dashboard.data.data?.account_no;
      if (!accountNumber) return;

      const transactions = await TransactionApi(accountNumber);
      if (transactions?.status === 200) {
        setTransactionData(transactions.data.data);
      }
    }
    void initialize();
  }, []);

  if (!isLogin) {
    return <h1>Unauthorized</h1>;
  }

  return (
    <main>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 p-4">
        {transactionData && <Overview transactionData={transactionData} />}
      </div>
    </main>
  );
}
