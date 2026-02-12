"use client";

import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import { checkIsLogin } from "@/helper/checkAuth";
import { Logout } from "@/helper/api/auth";
import Link from "next/link";

export const Header = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(checkIsLogin());
  }, []);
  const handleLogout = async () => {
    await Logout();
    setIsLoggedIn(false);
    router.push("/"); // Redirect after logout
  };

  return (
    <header className="flex justify-between items-center p-2 border-b-2 mb-2">
      <Link href="/">
        <div id="logo">
          <div className="relative z-20 flex items-center text-lg font-medium">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mr-2 h-6 w-6"
            >
              <path d="M15 6v12a3 3 0 1 0 3-3H6a3 3 0 1 0 3 3V6a3 3 0 1 0-3 3h12a3 3 0 1 0-3-3" />
            </svg>
            Optima Bank
          </div>
        </div>
      </Link>
      <div id="buttons">
        {isLoggedIn ? (
          <div id="logout">
            <Button onClick={handleLogout}>Logout</Button>
          </div>
        ) : (
          <div id="register">
            <Button onClick={() => router.push("/auth/register")}>
              Register
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};
