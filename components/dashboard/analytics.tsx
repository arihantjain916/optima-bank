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

  async function fetchData(email: string) {
    const res = await DashboardApi(email);
       if (res?.status != 200) {
      return;
    } 
    if (res?.data.data?.id) {
      await fetchTransaction(res?.data.data.account_no);
    }
  }

  async function fetchTransaction(account_no: string) {
    const res = await TransactionApi(account_no);
       if (res?.status != 200) {
      return;
    } 
    setTransactionData(res?.data.data);
  }

  useEffect(() => {
    async function initialize() {
      const token = getUserInfo() as JwtType;
      const id = token?.data?.id;
      if (id) {
        await fetchData(id);
      }
    }
    initialize();
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
