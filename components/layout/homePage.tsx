"use client";

import { checkIsLogin } from "@/helper/checkAuth";
import Link from "next/link";
import { useState, useEffect } from "react";

export const HomePage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

  useEffect(() => {
    const logged = checkIsLogin();
    setIsLoggedIn(logged);
  }, []);

  if (isLoggedIn === null) return null;

  return (
    <section className="bg-gray-900 text-white">
      <div className="mx-auto max-w-screen-xl px-4 py-32 lg:flex lg:h-screen lg:items-center">
        <div className="mx-auto max-w-3xl text-center">
          <h1 className="bg-gradient-to-r from-green-300 via-blue-500 to-purple-600 bg-clip-text text-3xl font-extrabold text-transparent sm:text-5xl">
            Innovative Banking Management System.
            <span className="sm:block">
              Streamline Your Financial Operations with Ease .
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl sm:text-xl/relaxed">
            An Online Bank System,s to make your finiancial life easier.
          </p>

          {isLoggedIn ? (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/dashboard"
              >
                Navigate to Dashboard
              </Link>
            </div>
          ) : (
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                className="block w-full rounded border border-blue-600 bg-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-transparent hover:text-white focus:outline-none focus:ring active:text-opacity-75 sm:w-auto"
                href="/auth/login"
              >
                Login
              </Link>

              <Link
                className="block w-full rounded border border-blue-600 px-12 py-3 text-sm font-medium text-white hover:bg-blue-600 focus:outline-none focus:ring active:bg-blue-500 sm:w-auto"
                href="/auth/login"
              >
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};
