"use client";

import { useState, useEffect } from "react";
import { AllTransaction } from "./component/alltrans";
import { DashboardType } from "@/types/userType";
import { DashboardApi, TransactionApi } from "@/helper/api";
import getUserInfo from "@/helper/getuserinfofromtoken";
import { TransactionType } from "@/types/transactionType";
import { JwtType } from "@/types/jwtPayload";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { checkIsLogin } from "@/helper/checkAuth";

export default function TransactionPage() {
  const isLogin = checkIsLogin();
  const [userdata, setUserData] = useState<DashboardType>();
  const [transactionData, setTransactionData] = useState<TransactionType[]>([]);

  async function fetchData(email: string) {
    const res = await DashboardApi(email);
    setUserData(res?.data.data);       
       if (res?.status != 200) {
      return;
    } 

    if (res?.data.data?.account_no) {
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
      const email = token?.data?.email;

      if (email) {
        await fetchData(email);
      }
    }
    initialize();
  }, []);

  if (!isLogin) {
    return <h1>Unauthorized</h1>;
  }


  return (
    <main className="p-2">
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Account Number
            </CardTitle>
            <svg
              fill="#ffff"
              width="800px"
              height="800px"
              viewBox="-1.5 0 19 19"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
            >
              <path d="M15.442 14.75v.491H.558v-.49a.476.476 0 0 1 .475-.476h.478a.487.487 0 0 1-.003-.048v-.443a.476.476 0 0 1 .475-.475h.713V7.164H1.508a.554.554 0 0 1-.22-1.063L7.78 3.288a.554.554 0 0 1 .44 0L14.712 6.1a.554.554 0 0 1-.22 1.063h-1.188v6.145h.713a.476.476 0 0 1 .475.475v.443a.443.443 0 0 1-.003.048h.478a.476.476 0 0 1 .475.475zM3.804 13.31h2.058V8.264H3.804zm.377-7.254h7.639L8 4.4zm2.79 2.21v5.043h2.058V8.265zm5.225 5.043V8.265h-2.059v5.044z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{userdata?.account_no}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Balance</CardTitle>
            <svg
              fill="#ffff"
              width="800px"
              height="800px"
              viewBox="-1.5 0 19 19"
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-muted-foreground"
            >
              <path d="M15.442 14.75v.491H.558v-.49a.476.476 0 0 1 .475-.476h.478a.487.487 0 0 1-.003-.048v-.443a.476.476 0 0 1 .475-.475h.713V7.164H1.508a.554.554 0 0 1-.22-1.063L7.78 3.288a.554.554 0 0 1 .44 0L14.712 6.1a.554.554 0 0 1-.22 1.063h-1.188v6.145h.713a.476.476 0 0 1 .475.475v.443a.443.443 0 0 1-.003.048h.478a.476.476 0 0 1 .475.475zM3.804 13.31h2.058V8.264H3.804zm.377-7.254h7.639L8 4.4zm2.79 2.21v5.043h2.058V8.265zm5.225 5.043V8.265h-2.059v5.044z" />
            </svg>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <CardContent>
                <div className="text-2xl font-bold">
                  ₹{userdata?.currentBalance}
                </div>
              </CardContent>
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="mt-2">
        <AllTransaction
          transactionData={transactionData}
          userdata={userdata!}
        />
      </div>
    </main>
  );
}
