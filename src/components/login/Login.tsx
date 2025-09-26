"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

export default function Login() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (!form.email.trim()) {
      toast.error("الرجاء إدخال الإيميل");
      return false;
    }
    if (!form.password.trim()) {
      toast.error("الرجاء إدخال كلمة المرور");
      return false;
    }
    return true;
  };

  const handleForgotPassword = () => {
    if (!form.email.trim()) {
      toast.error("الرجاء إدخال الإيميل أولاً");
      return;
    }
    router.push(`/verifyAccount?email=${encodeURIComponent(form.email)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const res = await fetch(
        "https://tinytales.trendline.marketing/api/auth/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        }
      );

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.status) {
        // ✅ حفظ التوكن والاسم
        if (data.data?.token) localStorage.setItem("token", data.data.token);
        if (data.data?.name) localStorage.setItem("userName", data.data.name);

        toast.success(data.message || "تم تسجيل الدخول بنجاح ✅");

        setTimeout(() => router.push("/"), 1200);
      } else {
        const msg =
          res.status === 422
            ? "الإيميل غير مسجل"
            : res.status === 400
            ? "خطأ في الإيميل أو كلمة المرور"
            : data.message || "حدث خطأ أثناء تسجيل الدخول";
        toast.error(msg);
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f2fe] flex justify-center items-center min-h-screen p-4 font-poppins">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-2">
          Login
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Welcome back! Log in to continue.
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="text-sm font-semibold text-gray-700 block mb-1"
            >
              Email:
            </label>
            <input
              id="email"
              name="email"
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-400"
              placeholder="Enter your email"
              value={form.email}
              onChange={handleChange}
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="text-sm font-semibold text-gray-700 block mb-1"
            >
              Password:
            </label>
            <div className="relative">
              <input
                id="password"
                name="password"
                type={showPassword ? "text" : "password"}
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-400"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() => setShowPassword((prev) => !prev)}
              >
                <Image
                  src={
                    showPassword
                      ? "/imges/eye-view-svgrepo-com.png"
                      : "/imges/eye-closed-svgrepo-com (1).png"
                  }
                  alt="toggle password visibility"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* Forgot password */}
          <div className="text-right">
            <button
              type="button"
              onClick={handleForgotPassword}
              className="text-indigo-600 text-sm underline font-medium hover:text-indigo-700 cursor-pointer"
            >
              Forgot password?
            </button>
          </div>

          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          {/* OR Divider */}
          <div className="flex items-center my-5">
            <div className="flex-grow h-[1px] bg-gray-300" />
            <span className="px-3 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-[1px] bg-gray-300" />
          </div>

          {/* Google Login */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 w-full border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition"
          >
            <Image
              src="/imges/google-icon-logo-svgrepo-com.png"
              alt="Google icon"
              width={20}
              height={20}
            />
            Login with Google
          </button>

          {/* Signup link */}
          <p className="text-center text-sm text-gray-500">
            Don&apos;t have an account?{" "}
            <Link
              href="/register"
              className="text-indigo-600 font-semibold underline"
            >
              Signup
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
