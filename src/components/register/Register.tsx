"use client";
import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";

// ✅ واجهة الرد من الـ API
interface ApiResponse {
  status: boolean;
  status_code?: number;
  message?: string;
  data?: {
    token?: string;
    name?: string;
    id?: number;
    email?: string;
    type?: string;
  };
}

export default function Register() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    mobile: "",
    mobile_country_code: "",
  });
  const [show, setShow] = useState({
    password: false,
    confirmPassword: false,
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const isStrongPassword = (pwd: string) =>
    /^(?=.*[A-Za-z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(
      pwd
    );

  // ✅ تحقق من المدخلات
  const validate = () => {
    const {
      name,
      email,
      password,
      password_confirmation,
      mobile,
      mobile_country_code,
    } = form;

    if (!name.trim() || name.length < 2)
      return toast.error("الاسم يجب أن يكون حرفين على الأقل");

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      return toast.error("الرجاء إدخال بريد إلكتروني صحيح");

    if (!isStrongPassword(password))
      return toast.error(
        "كلمة المرور يجب أن تحتوي على 8 أحرف على الأقل، وأرقام، ورموز خاصة"
      );

    if (password !== password_confirmation)
      return toast.error("كلمتا المرور غير متطابقتين!");

    if (!mobile_country_code) return toast.error("يرجى اختيار كود الدولة");

    if (!/^\d+$/.test(mobile))
      return toast.error("رقم الهاتف يجب أن يحتوي على أرقام فقط");

    // ✅ الطول المطلوب حسب الدولة
    const phoneLengthByCountry: Record<string, number> = {
      "20": 10, // مصر
      "966": 9, // السعودية
      "971": 9, // الإمارات
      "1": 10, // أمريكا
      "44": 10, // بريطانيا
    };

    const requiredLength = phoneLengthByCountry[mobile_country_code];
    if (!requiredLength) return toast.error("كود الدولة غير مدعوم حاليًا");

    if (mobile.length !== requiredLength)
      return toast.error(
        `رقم الهاتف في هذه الدولة يجب أن يحتوي على ${requiredLength} أرقام`
      );

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() !== true) return;
    setLoading(true);

    try {
      const formData = new FormData();
      Object.entries(form).forEach(([key, value]) => {
        formData.append(key, value);
      });

      const res = await fetch(
        "https://tinytales.trendline.marketing/api/auth/register",
        {
          method: "POST",
          body: formData,
        }
      );

      const data: ApiResponse = await res.json().catch(() => ({
        status: false,
        message: "Unexpected response",
      }));

      console.log("Register Response:", data);

      if (res.ok && data.status && data.status_code === 200) {
        if (data.data?.token) localStorage.setItem("token", data.data.token);
        if (data.data?.name) localStorage.setItem("userName", data.data.name);
        toast.success(data.message || "تم التسجيل بنجاح ✅");
        setTimeout(() => router.push("/"), 1000);
      } else {
        toast.error(
          data.message ||
            (res.status === 422
              ? "الإيميل موجود مسبقًا"
              : "حدث خطأ أثناء التسجيل")
        );
      }
    } catch (err) {
      console.error("Register Error:", err);
      toast.error("حدث خطأ في الاتصال بالسيرفر");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#f0f2fe] flex justify-center items-center min-h-screen p-4 font-poppins">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-full max-w-sm">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-1">
          Register
        </h2>
        <p className="text-center text-gray-500 mb-6">
          Create your account to continue
        </p>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* الاسم */}
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1">
              Full Name
            </label>
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="Your full name"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* البريد الإلكتروني */}
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1">
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={form.email}
              onChange={handleChange}
              placeholder="example@email.com"
              className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
            />
          </div>

          {/* كلمة المرور */}
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1">
              Password
            </label>
            <div className="relative">
              <input
                type={show.password ? "text" : "password"}
                name="password"
                value={form.password}
                onChange={handleChange}
                placeholder="Example@123"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() =>
                  setShow((s) => ({ ...s, password: !s.password }))
                }
              >
                <Image
                  src={
                    show.password
                      ? "/imges/eye-view-svgrepo-com.png"
                      : "/imges/eye-closed-svgrepo-com (1).png"
                  }
                  alt="toggle password"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* تأكيد كلمة المرور */}
          <div>
            <label className="text-sm font-semibold text-gray-800 block mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                type={show.confirmPassword ? "text" : "password"}
                name="password_confirmation"
                value={form.password_confirmation}
                onChange={handleChange}
                placeholder="Confirm your password"
                className="w-full p-2 border border-gray-300 rounded-md pr-10 focus:ring-2 focus:ring-indigo-400 outline-none"
              />
              <button
                type="button"
                className="absolute right-3 top-2.5"
                onClick={() =>
                  setShow((s) => ({
                    ...s,
                    confirmPassword: !s.confirmPassword,
                  }))
                }
              >
                <Image
                  src={
                    show.confirmPassword
                      ? "/imges/eye-view-svgrepo-com.png"
                      : "/imges/eye-closed-svgrepo-com (1).png"
                  }
                  alt="toggle confirm password"
                  width={20}
                  height={20}
                />
              </button>
            </div>
          </div>

          {/* الهاتف */}
          <div className="flex gap-2">
            <div className="w-1/3">
              <label className="text-sm font-semibold text-gray-800 block mb-1">
                Code
              </label>
              <select
                name="mobile_country_code"
                value={form.mobile_country_code}
                onChange={handleChange}
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              >
                <option value="">+ Code</option>
                <option value="20">+20</option>
                <option value="971">+971</option>
                <option value="966">+966</option>
                <option value="1">+1</option>
                <option value="44">+44</option>
              </select>
            </div>
            <div className="w-2/3">
              <label className="text-sm font-semibold text-gray-800 block mb-1">
                Mobile
              </label>
              <input
                type="tel"
                name="mobile"
                value={form.mobile}
                onChange={handleChange}
                placeholder="1234567890"
                className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-400 outline-none"
              />
            </div>
          </div>

          {/* زر التسجيل */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-indigo-600 text-white rounded-md py-2 hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? (
              <div className="flex justify-center items-center gap-2">
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                >
                  <circle
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                    fill="none"
                  />
                </svg>
                Registering...
              </div>
            ) : (
              "Register"
            )}
          </button>

          {/* Divider */}
          <div className="flex items-center my-4">
            <div className="flex-grow h-[1px] bg-gray-300"></div>
            <span className="px-2 text-gray-500 text-sm">or</span>
            <div className="flex-grow h-[1px] bg-gray-300"></div>
          </div>

          {/* Google */}
          <button
            type="button"
            className="flex items-center justify-center gap-2 border border-gray-300 p-2 rounded-md hover:bg-gray-100 transition w-full"
          >
            <Image
              src="/imges/google-icon-logo-svgrepo-com.png"
              alt="Google"
              width={20}
              height={20}
            />
            Register with Google
          </button>

          {/* رابط تسجيل الدخول */}
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link
              href="/login"
              className="text-indigo-600 font-semibold underline"
            >
              Login
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
