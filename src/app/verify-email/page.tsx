"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { Alert } from "@/components/ui/Alert";
import { AuthBrandPanel } from "@/components/auth/AuthBrandPanel";
import { useAuth } from "@/lib/auth-store";

function VerifyEmailContent() {
  const params = useSearchParams();
  const userId = params.get("userId") || "";
  const { verifyEmail } = useAuth();
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#2a3344] px-4 py-10">
      <div className="grid w-full max-w-[980px] overflow-hidden rounded-[18px] bg-white shadow-[0_20px_60px_rgba(0,0,0,0.35)] md:grid-cols-2">
        <div className="min-h-[640px]">
          <AuthBrandPanel />
        </div>
        <div className="flex flex-col justify-center bg-white px-8 py-12 sm:px-12 lg:px-14">
          <h1 className="text-[34px] font-bold leading-none text-[#1a1a1a]">Verify Email</h1>
          <p className="mt-2 text-[15px] text-[#8a94a6]">
            Simulated verification for development
          </p>

          <div className="mt-9 space-y-4">
            <Alert tone="info">
              A verification email would normally be sent. For development, verify instantly.
            </Alert>
            <button
              type="button"
              disabled={!userId}
              className="w-full rounded-md bg-[#2f4d9a] py-3.5 text-[16px] font-semibold text-white transition hover:bg-[#243d7a] disabled:cursor-not-allowed disabled:opacity-50"
              onClick={() => {
                verifyEmail(userId);
                router.push("/login");
              }}
            >
              Verify Email & Continue to Login
            </button>
            {!userId ? (
              <Alert tone="danger">Missing user id. Please register again.</Alert>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="p-8 text-sm text-muted">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
