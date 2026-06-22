"use client";

import { DashboardApi } from "@/helper/api";
import { DashboardType } from "@/types/userType";
import { useState, useEffect } from "react";
import TransferCard from "./component/transferCard";

export default function TransferPage() {
  const [userdata, setUserData] = useState<DashboardType>();

  async function fetchData() {
    const res = await DashboardApi("me");
    if (res?.status != 200) {
      {
        return;
      }
    }
    setUserData(res?.data.data);
  }

  useEffect(() => {
    async function initialize() {
      await fetchData();
    }
    initialize();
  }, []);

  return userdata && <TransferCard userData={userdata} />;
}
