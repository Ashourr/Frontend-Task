"use client";
import Link from "next/link";
import React, { useState, useEffect } from "react";
import toast from "react-hot-toast";

export default function Header() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    // تحقق من وجود التوكن في localStorage عند التحميل
    const token = localStorage.getItem("token");
    if (token) {
      setIsLoggedIn(true);
    }
  }, []);

  const handleLogout = async () => {
    try {
      await fetch("https://tinytales.trendline.marketing/api/auth/logout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
    } catch (error) {
      console.error("Logout API error:", error);
    }
    localStorage.removeItem("token");
    localStorage.removeItem("userName");
    window.location.reload();
    setIsLoggedIn(false);
    toast.success("تم تسجيل الخروج");
  };

  return (
    <header className="bg-white shadow-md py-4">
      <div className="container mx-auto flex justify-between items-center px-4">
        <h1 className="text-2xl font-bold text-indigo-600">Frontend Task</h1>
        <div>
          {isLoggedIn ? (
            <a
              href="#"
              onClick={handleLogout}
              className="text-red-600 underline hover:text-red-800 transition duration-200"
            >
              Logout
            </a>
          ) : (
            <Link
              href="/login"
              className="text-indigo-600 underline hover:text-indigo-800 transition duration-200"
            >
              Login
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
