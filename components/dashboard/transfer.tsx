"use client";

import { DashboardApi } from "@/helper/api";
import getUserInfo from "@/helper/getuserinfofromtoken";
import { JwtType } from "@/types/jwtPayload";
import { DashboardType } from "@/types/userType";
import { useState, useEffect } from "react";
import TransferCard from "./component/transferCard";
import { checkIsLogin } from "@/helper/checkAuth";

export default function TransferPage() {
  const isLogin = checkIsLogin();
  const [userdata, setUserData] = useState<DashboardType>();

  async function fetchData(email: string) {
    const res = await DashboardApi(email);
    if (res?.status != 200) {
      {
        return;
      }
    }
    setUserData(res?.data.data);
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
  return userdata && <TransferCard userData={userdata} />;
}
