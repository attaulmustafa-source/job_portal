"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/lib/auth-store";
import { dashboardPath } from "@/lib/nav";

function EyeIcon({ open }: { open: boolean }) {
  if (open) {
    return (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 5C7 5 2.7 8.1 1 12c1.7 3.9 6 7 11 7s9.3-3.1 11-7c-1.7-3.9-6-7-11-7zm0 12a5 5 0 1 1 0-10 5 5 0 0 1 0 10zm0-8a3 3 0 1 0 0 6 3 3 0 0 0 0-6z"
          fill="#6b7c99"
        />
      </svg>
    );
  }
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 6a9.8 9.8 0 0 1 9.5 6.5 9.8 9.8 0 0 1-3.2 4.1l1.4 1.4-1.4 1.4-16-16L3.7 2.4l3.1 3.1A9.7 9.7 0 0 1 12 6zm0 12c-5 0-9.3-3.1-11-7a10.4 10.4 0 0 1 4.3-5.1l2.2 2.2A5 5 0 0 0 14.9 14l2.3 2.3A9.6 9.6 0 0 1 12 18zm-1.1-7.5 2.6 2.6a2 2 0 0 1-2.6-2.6z"
        fill="#6b7c99"
      />
    </svg>
  );
}

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("jp_remember");
    if (saved) setIdentifier(saved);
  }, []);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = login(identifier.trim(), password);
    if (!result.ok || !result.role) {
      setError(result.message);
      return;
    }
    if (remember) {
      localStorage.setItem("jp_remember", identifier.trim());
    } else {
      localStorage.removeItem("jp_remember");
    }
    router.push(dashboardPath(result.role));
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2a3344] px-4 py-10">
      <div className="grid w-full max-w-[980px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
        {/* LEFT — logo + all AMS brand text */}
        <div className="min-h-[640px]">
          <AuthBrandPanel />
        </div>

        {/* RIGHT — Sign In form */}
        <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-14">
          <h1 className="text-[34px] font-bold leading-none text-[#1a1a1a]">Sign In</h1>
          <p className="mt-2 text-[15px] text-[#8a94a6]">Enter your credentials to continue</p>

          <form className="mt-9 space-y-5" onSubmit={onSubmit}>
            {error ? <Alert tone="danger">{error}</Alert> : null}

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Email or Username</span>
              <input
                className="w-full rounded-md border border-[#2f4d9a]/55 bg-[#eef2fb] px-3.5 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#2f4d9a] focus:ring-1 focus:ring-[#2f4d9a]/30"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                autoComplete="username"
                required
              />
            </label>

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className="w-full rounded-md border border-[#2f4d9a]/55 bg-[#eef2fb] px-3.5 py-3 pr-11 text-[15px] text-[#1a1a1a] outline-none focus:border-[#2f4d9a] focus:ring-1 focus:ring-[#2f4d9a]/30"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  <EyeIcon open={showPassword} />
                </button>
              </div>
            </label>

            <div className="flex items-center justify-between pt-0.5 text-[14px]">
              <label className="flex cursor-pointer items-center gap-2 text-[#2c3a4f]">
                <input
                  type="checkbox"
                  className="h-4 w-4 rounded border-[#c5cedd] accent-[#2f4d9a]"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                Remember me
              </label>
              <Link href="/forgot-password" className="text-[#8a94a6] transition hover:text-[#2f4d9a]">
                Forgot Password?
              </Link>
            </div>

            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#2f4d9a] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#243d7a]"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
