"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";
import { roleLabels } from "@/lib/nav";

function InfoRow({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="border-b border-[#eef2f7] py-2.5 last:border-0">
      <p className="text-sm text-[#1b2a4a]">
        <span className="font-semibold">{label} :</span>{" "}
        <span className="font-normal text-[#5b6b85]">{value}</span>
      </p>
    </div>
  );
}

export default function AdminProfilePage() {
  const { user } = useAuth();
  if (!user) return null;

  const name = user.fullName?.trim() || "Admin User";
  const username = user.username || user.email.split("@")[0];

  return (
    <div className="pb-6">
      {/* Blue banner + centered NAVTTC crest */}
      <div className="relative mb-[4.5rem]">
        <div className="h-[7.5rem] rounded-xl bg-[#2f4d9a] sm:h-32" />
        <div className="absolute left-1/2 top-full z-10 flex h-[5.25rem] w-[5.25rem] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-xl border border-[#e5ebf5] bg-white p-1.5 shadow-md sm:h-24 sm:w-24">
          <div className="relative h-full w-full overflow-hidden rounded-lg bg-black">
            <Image
              src="/navttc-crest.png"
              alt="NAVTTC"
              fill
              className="object-contain p-1"
              sizes="96px"
              priority
            />
          </div>
        </div>
      </div>

      {/* Left: Admin User · Right: About */}
      <div className="grid items-start gap-5 lg:grid-cols-[minmax(0,22rem)_minmax(0,1fr)]">
        <section className="rounded-xl border border-[#e5ebf5] bg-white px-6 pb-6 pt-7 shadow-sm">
          <div className="flex flex-col items-center text-center">
            <div className="relative">
              <div className="flex h-[5.5rem] w-[5.5rem] items-center justify-center rounded-full bg-[#2f4d9a] text-white shadow-sm">
                <svg width="42" height="42" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.6" />
                  <path
                    d="M5 19c1.8-3.2 4-4.8 7-4.8s5.2 1.6 7 4.8"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <span
                className="absolute bottom-0 right-0 flex h-7 w-7 items-center justify-center rounded-full border-2 border-white bg-[#2f4d9a] text-white"
                title="Profile photo"
              >
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M4 8.5h3l1.2-2h7.6l1.2 2H20a1.5 1.5 0 0 1 1.5 1.5v8A1.5 1.5 0 0 1 20 19.5H4A1.5 1.5 0 0 1 2.5 18v-8A1.5 1.5 0 0 1 4 8.5Z"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinejoin="round"
                  />
                  <circle cx="12" cy="13.5" r="2.6" stroke="currentColor" strokeWidth="1.5" />
                </svg>
              </span>
            </div>

            <h1 className="mt-4 text-base font-bold text-[#1b2a4a]">{name}</h1>
            <p className="mt-0.5 text-sm text-[#6b7c99]">{username}</p>
            <p className="mt-1.5 inline-flex items-center gap-1.5 text-sm text-[#6b7c99]">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
                <path
                  d="m4 7 8 6 8-6"
                  stroke="currentColor"
                  strokeWidth="1.6"
                  strokeLinecap="round"
                />
              </svg>
              {user.email}
            </p>
          </div>

          <div className="mt-7 text-left">
            <h2 className="mb-1 text-sm font-bold text-[#1b2a4a]">Basic Info :</h2>
            <InfoRow label="Name" value={name} />
            <InfoRow label="Username" value={username} />
            <InfoRow label="Email" value={user.email} />
            <InfoRow label="Type" value={roleLabels[user.role]} />
            <InfoRow
              label="Account Status"
              value={<StatusBadge label="Active" tone="success" />}
            />
          </div>
        </section>

        <section className="min-h-[22rem] rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm sm:p-6">
          <div className="mb-4">
            <span className="inline-flex rounded-md bg-[#2f4d9a] px-3.5 py-1.5 text-xs font-semibold text-white">
              About
            </span>
          </div>
          <div className="rounded-lg border border-[#e5ebf5] bg-white p-5">
            <div className="mb-2 flex items-center gap-2">
              <span className="text-lg leading-none text-amber-400" aria-hidden>
                ✦
              </span>
              <h2 className="text-sm font-bold text-[#1b2a4a]">About Info</h2>
            </div>
            <p className="text-sm leading-relaxed text-[#6b7c99]">
              Welcome to your profile page. Here you can view and manage your account information.
            </p>
          </div>
        </section>
      </div>
    </div>
  );
}
