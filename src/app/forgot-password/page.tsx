"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setSent(true);
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2a3344] px-4 py-10">
      <div className="grid w-full max-w-[980px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
        <div className="hidden min-h-[520px] md:block">
          <AuthBrandPanel />
        </div>

        <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-14">
          <h1 className="text-[34px] font-bold leading-none text-[#1a1a1a]">Forgot Password</h1>
          <p className="mt-2 text-[15px] text-[#8a94a6]">
            Enter your email and we will send a reset link (simulated for this demo).
          </p>

          {sent ? (
            <div className="mt-8 space-y-4">
              <Alert tone="success">
                If an account exists for <strong>{email}</strong>, a reset link would be sent.
                For this demo, return to login and use your known password.
              </Alert>
              <Link
                href="/login"
                className="inline-flex w-full items-center justify-center rounded-md bg-[#2f4d9a] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#243d7a]"
              >
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form className="mt-8 space-y-5" onSubmit={onSubmit}>
              <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
                <span>Email</span>
                <input
                  type="email"
                  className="w-full rounded-md border border-[#2f4d9a]/55 bg-[#eef2fb] px-3.5 py-3 text-[15px] outline-none focus:border-[#2f4d9a]"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </label>
              <button
                type="submit"
                className="w-full rounded-md bg-[#2f4d9a] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#243d7a]"
              >
                Send Reset Link
              </button>
              <p className="text-center text-[14px] text-[#8a94a6]">
                Remembered it?{" "}
                <Link href="/login" className="font-semibold text-[#2f4d9a]">
                  Sign In
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
