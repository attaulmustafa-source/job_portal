"use client";

import Link from "next/link";
import { FormEvent, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/lib/auth-store";

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

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [role, setRole] = useState<"seeker" | "employer">("seeker");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [organizationName, setOrganizationName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const q = searchParams.get("role");
    if (q === "employer" || q === "seeker") setRole(q);
  }, [searchParams]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) {
      setError("Password and confirm password do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    const result = register({
      email: email.trim(),
      password,
      role,
      phone: phone.trim(),
      ...(role === "employer"
        ? { organizationName: organizationName.trim() }
        : {
            firstName: firstName.trim(),
            lastName: lastName.trim(),
          }),
    });
    if (!result.ok || !result.userId) {
      setError(result.message);
      return;
    }
    router.push(`/verify-email?userId=${encodeURIComponent(result.userId)}`);
  }

  const inputClass =
    "w-full rounded-md border border-[#2f4d9a]/55 bg-[#eef2fb] px-3.5 py-3 text-[15px] text-[#1a1a1a] outline-none focus:border-[#2f4d9a] focus:ring-1 focus:ring-[#2f4d9a]/30";

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2a3344] px-4 py-10">
      <div className="grid w-full max-w-[980px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
        <div className="min-h-[640px]">
          <AuthBrandPanel />
        </div>

        <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-14">
          <h1 className="text-[34px] font-bold leading-none text-[#1a1a1a]">Register</h1>
          <p className="mt-2 text-[15px] text-[#8a94a6]">Create an account to continue</p>

          <form className="mt-8 space-y-4" onSubmit={onSubmit}>
            {error ? <Alert tone="danger">{error}</Alert> : null}

            <div className="space-y-2">
              <p className="text-[14px] font-medium text-[#2c3a4f]">Register as</p>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("seeker")}
                  className={`rounded-md border px-3 py-2.5 text-sm font-medium ${
                    role === "seeker"
                      ? "border-[#2f4d9a] bg-[#2f4d9a] text-white"
                      : "border-[#d0d7e6] bg-white text-[#2c3a4f]"
                  }`}
                >
                  Job Seeker
                </button>
                <button
                  type="button"
                  onClick={() => setRole("employer")}
                  className={`rounded-md border px-3 py-2.5 text-sm font-medium ${
                    role === "employer"
                      ? "border-[#2f4d9a] bg-[#2f4d9a] text-white"
                      : "border-[#d0d7e6] bg-white text-[#2c3a4f]"
                  }`}
                >
                  Employer
                </button>
              </div>
            </div>

            {role === "employer" ? (
              <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
                <span>Organization Name</span>
                <input
                  type="text"
                  className={inputClass}
                  value={organizationName}
                  onChange={(e) => setOrganizationName(e.target.value)}
                  required
                />
              </label>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
                  <span>First Name</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={firstName}
                    onChange={(e) => setFirstName(e.target.value)}
                    required
                  />
                </label>
                <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
                  <span>Last Name</span>
                  <input
                    type="text"
                    className={inputClass}
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                    required
                  />
                </label>
              </div>
            )}

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Mobile Phone Number</span>
              <input
                type="tel"
                className={inputClass}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="03XX-XXXXXXX"
                required
              />
            </label>

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Email</span>
              <input
                type="email"
                className={inputClass}
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </label>

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Password</span>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  className={`${inputClass} pr-11`}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
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

            <label className="block space-y-2 text-[14px] font-medium text-[#2c3a4f]">
              <span>Confirm password</span>
              <input
                type={showPassword ? "text" : "password"}
                className={inputClass}
                value={confirm}
                onChange={(e) => setConfirm(e.target.value)}
                required
              />
            </label>

            <button
              type="submit"
              className="mt-1 w-full rounded-md bg-[#2f4d9a] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#243d7a]"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-[14px] text-[#8a94a6]">
            Already have an account?{" "}
            <Link href="/login" className="font-semibold text-[#2f4d9a]">
              Sign In
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
