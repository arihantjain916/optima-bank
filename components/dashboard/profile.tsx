"use client";

import { DashboardApi } from "@/helper/api";
import getUserInfo from "@/helper/getuserinfofromtoken";
import { JwtType } from "@/types/jwtPayload";
import { User } from "@prisma/client";
import { useState, useEffect } from "react";
import ProfileCard from "./component/profileCard";
import UpdatePass from "./component/updatePass";
import { checkIsLogin } from "@/helper/checkAuth";

export default function ProfilePage() {
  const isLogin = checkIsLogin();
  const [userdata, setUserData] = useState<User>();

  async function fetchData(email: string) {
    const res = await DashboardApi(email);
       if (res?.status != 200) {
      return;
    };
    setUserData(res?.data.data);
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
        {userdata && <ProfileCard userData={userdata} />}
        {userdata && <UpdatePass userData={userdata} />}
      </div>
    </main>
  );
}
