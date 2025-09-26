"use client";
import React, { useEffect, useState } from "react";
import Header from "@/components/header/Header";

export default function Home() {
  const [userName, setUserName] = useState<string | null>(null);

  // ✅ نجلب الاسم من localStorage بعد تحميل الصفحة (علشان Next.js SSR)
  useEffect(() => {
    const storedName = localStorage.getItem("userName");
    if (storedName) setUserName(storedName);
  }, []);

  return (
    <>
      <Header />
      <div className="flex flex-col items-center justify-center min-h-screen bg-[#f0f2fe] font-poppins text-center">
        <p className="text-lg text-gray-700">
          Welcome back,{" "}
          <span className="font-semibold text-indigo-600">
            {userName || "Guest"}!
          </span>
        </p>
      </div>
    </>
  );
}
