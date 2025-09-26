"use client";
import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { useSearchParams, useRouter } from "next/navigation";
import toast from "react-hot-toast";

export default function VerifyAccount() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "Not provided";
  const router = useRouter();

  const [otp, setOtp] = useState<string[]>(new Array(6).fill(""));
  const [loading, setLoading] = useState(false);
  // initialize with 6 nulls so indices exist
  const inputRefs = useRef<(HTMLInputElement | null)[]>(
    new Array(6).fill(null)
  );

  useEffect(() => {
    inputRefs.current[0]?.focus();
  }, []);

  const generateToken = () => Math.random().toString(36).substr(2, 10);

  const handleChange = (value: string, index: number) => {
    // accept only single digit or empty
    const digit = value.replace(/\D/g, "");
    if (digit === "" || /^[0-9]$/.test(digit)) {
      const newOtp = [...otp];
      newOtp[index] = digit;
      setOtp(newOtp);

      if (digit !== "" && index < inputRefs.current.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (
    e: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (e.key === "Backspace" && otp[index] === "" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault(); // prevent the default paste into single input
    const pasteData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pasteData)) {
      const digits = pasteData.split("");
      setOtp(digits);
      // focus last
      inputRefs.current[5]?.focus();
    } else {
      toast.error("يُرجى لصق كود مكون من 6 أرقام فقط");
    }
  };

  const handleResend = () => {
    toast.success(`📨 تم إرسال الكود مرة أخرى إلى ${email}`);
    // هنا ممكن تستدعي API لإعادة إرسال الكود
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const code = otp.join("");

    if (code.length === 6 && /^\d+$/.test(code)) {
      setLoading(true);

      // محاكاة طلب للـ API
      setTimeout(() => {
        const newToken = generateToken();
        localStorage.setItem("token", newToken);
        toast.success("✅ تم التحقق من الحساب بنجاح!");
        router.push("/");
        setLoading(false);
      }, 1200);
    } else {
      toast.error("❌ كود غير صالح. يُرجى إدخال 6 أرقام صحيحة.");
    }
  };

  return (
    <div className="bg-[#f0f2fe] p-3 flex justify-center items-center min-h-screen font-poppins">
      <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-[400px] mx-auto">
        <h2 className="text-2xl font-extrabold text-center text-indigo-600">
          Verify Code
        </h2>
        <p className="text-center font-light mb-6 text-gray-500">
          Please enter the 6-digit code sent to your email:{" "}
          <span className="font-semibold text-indigo-600">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="flex justify-between gap-2">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(el) => {
                  // use a block callback so the function returns void (fixes the TS error)
                  inputRefs.current[index] = el;
                }}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                className="w-12 h-12 text-center text-xl border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500 transition"
                aria-label={`OTP digit ${index + 1}`}
              />
            ))}
          </div>

          <p className="text-sm text-gray-500 text-center">
            Didn’t receive the code?{" "}
            <button
              type="button"
              onClick={handleResend}
              className="text-indigo-600 font-semibold underline hover:text-indigo-800 transition"
            >
              Resend code
            </button>
          </p>

          <div className="text-center">
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-indigo-600 text-white rounded-md font-semibold hover:bg-indigo-700 transition duration-300 disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Verify"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
