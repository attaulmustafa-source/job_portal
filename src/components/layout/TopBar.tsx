"use client";

import Link from "next/link";
import { useAuth } from "@/lib/auth-store";
import type { UserAccount, UserRole } from "@/lib/types";

function liveStamp() {
  const now = new Date();
  const monthYear = now.toLocaleString("en-US", { month: "long", year: "numeric" });
  return `Live • Updated just now • ${monthYear}`;
}

export function TopBar({
  role,
  user,
  onOpenMobile,
}: {
  role: UserRole;
  user: UserAccount;
  onOpenMobile?: () => void;
}) {
  const { notifications } = useAuth();
  const notifHref = `/${role}/notifications`;
  const unread = notifications.filter((n) => n.userId === user.id && !n.read).length;

  return (
    <header className="sticky top-0 z-30 border-b border-[#e5ebf5] bg-white/95 backdrop-blur">
      <div className="flex items-center justify-between gap-3 px-3 py-2.5 sm:px-4">
        <div className="flex min-w-0 items-center gap-2.5">
          {onOpenMobile ? (
            <button
              type="button"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#dbe3ef] text-[#2f4d9a] lg:hidden"
              onClick={onOpenMobile}
              aria-label="Open menu"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              </svg>
            </button>
          ) : null}
          <div className="min-w-0">
            <h2 className="truncate text-sm font-semibold text-[#1b2a4a] sm:text-[15px]">
              Welcome to Job Portal Management System
            </h2>
            <p className="mt-0.5 flex items-center gap-1.5 text-[11px] text-[#6b7c99]">
              <span
                className="inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[#22c55e]"
                aria-hidden
              />
              <span className="truncate">{liveStamp()}</span>
            </p>
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-2">
          <Link
            href={notifHref}
            className="relative inline-flex h-8 w-8 items-center justify-center rounded-md border border-[#dbe3ef] bg-white text-[#1b2a4a] hover:bg-[#f8fafc]"
            title="Notifications"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
              <path
                d="M6.5 9.5a5.5 5.5 0 0 1 11 0c0 4 1.5 5.5 1.5 5.5H5s1.5-1.5 1.5-5.5Z"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinejoin="round"
              />
              <path
                d="M10 18a2 2 0 0 0 4 0"
                stroke="currentColor"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
            {unread > 0 ? (
              <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-[#dc2626] px-1 text-[10px] font-semibold text-white">
                {unread > 9 ? "9+" : unread}
              </span>
            ) : null}
            <span className="sr-only">
              Notifications{unread ? `, ${unread} unread` : ""}
            </span>
          </Link>
        </div>
      </div>
    </header>
  );
}
