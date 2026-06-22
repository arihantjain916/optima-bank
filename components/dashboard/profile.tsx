"use client";

import { DashboardApi } from "@/helper/api";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import ProfileCard from "./component/profileCard";
import UpdatePass from "./component/updatePass";

export default function ProfilePage() {
  const [userdata, setUserData] = useState<User>();

  async function fetchData() {
    const res = await DashboardApi("me");
       if (res?.status != 200) {
      return;
    };
    setUserData(res?.data.data);
  }

  useEffect(() => {
    async function initialize() {
      await fetchData();
    }
    initialize();
  }, []);

  return (
    <main>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4 mt-2 p-4">
        {userdata && <ProfileCard userData={userdata} />}
        {userdata && <UpdatePass userData={userdata} />}
      </div>
    </main>
  );
}
