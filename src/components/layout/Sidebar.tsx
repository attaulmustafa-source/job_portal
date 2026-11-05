"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  changePasswordPath,
  displayName,
  navGroupsByRole,
  profilePath,
  roleLabels,
} from "@/lib/nav";
import type { UserAccount, UserRole } from "@/lib/types";

function NavIcon({ label }: { label: string }) {
  const common = "h-[20px] w-[20px] shrink-0";
  const stroke = "currentColor";
  switch (label.toLowerCase()) {
    case "dashboard":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3.5" y="3.5" width="7" height="7" rx="1.2" stroke={stroke} strokeWidth="1.6" />
          <rect x="13.5" y="3.5" width="7" height="7" rx="1.2" stroke={stroke} strokeWidth="1.6" />
          <rect x="3.5" y="13.5" width="7" height="7" rx="1.2" stroke={stroke} strokeWidth="1.6" />
          <rect x="13.5" y="13.5" width="7" height="7" rx="1.2" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "profile":
    case "basic profile":
    case "qualification":
    case "experience":
    case "skills":
    case "certifications":
    case "languages":
    case "projects":
    case "references":
    case "employers":
    case "all employers":
    case "active":
    case "pending":
    case "government":
    case "private":
    case "foreign":
    case "job seekers":
    case "placement officers":
    case "applicants":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="8" r="3.2" stroke={stroke} strokeWidth="1.6" />
          <path d="M5 19c1.8-3.2 4-4.8 7-4.8s5.2 1.6 7 4.8" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "jobs":
    case "manage jobs":
    case "post a job":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <rect x="3" y="7" width="18" height="13" rx="2" stroke={stroke} strokeWidth="1.6" />
          <path d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "applications":
    case "bookings":
    case "sessions":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M8 4h8a2 2 0 0 1 2 2v14l-6-3-6 3V6a2 2 0 0 1 2-2z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
        </svg>
      );
    case "resumes":
    case "resume templates":
    case "templates":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z" stroke={stroke} strokeWidth="1.6" />
          <path d="M14 3v4h4M8 12h8M8 16h6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "counselling":
    case "placement centers":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M12 21s-7-4.4-7-10a7 7 0 1 1 14 0c0 5.6-7 10-7 10z" stroke={stroke} strokeWidth="1.6" />
          <circle cx="12" cy="11" r="2.2" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "organization":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M4 20V8l8-4 8 4v12" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M9 20v-6h6v6" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
    case "reports":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M5 19V9M12 19V5M19 19v-7" stroke={stroke} strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      );
    case "notifications":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <path d="M6 9a6 6 0 1 1 12 0c0 4 1.5 5.5 1.5 5.5H4.5S6 13 6 9z" stroke={stroke} strokeWidth="1.6" strokeLinejoin="round" />
          <path d="M10 18.5a2 2 0 0 0 4 0" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    case "settings":
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="3" stroke={stroke} strokeWidth="1.6" />
          <path d="M12 3.5v2.2M12 18.3v2.2M4.9 6.5l1.6 1.6M17.5 15.9l1.6 1.6M3.5 12h2.2M18.3 12h2.2M4.9 17.5l1.6-1.6M17.5 8.1l1.6-1.6" stroke={stroke} strokeWidth="1.6" strokeLinecap="round" />
        </svg>
      );
    default:
      return (
        <svg className={common} viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="12" cy="12" r="7" stroke={stroke} strokeWidth="1.6" />
        </svg>
      );
  }
}

function MenuIcon({ kind }: { kind: "profile" | "password" | "logout" }) {
  const stroke = "#2f4d9a";
  if (kind === "profile") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <circle cx="12" cy="8" r="3.2" stroke={stroke} strokeWidth="1.7" />
        <path d="M5 19c1.8-3.2 4-4.8 7-4.8s5.2 1.6 7 4.8" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  if (kind === "password") {
    return (
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
        <rect x="5" y="11" width="14" height="9" rx="2" stroke={stroke} strokeWidth="1.7" />
        <path d="M8 11V8a4 4 0 1 1 8 0v3" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      </svg>
    );
  }
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path d="M10 7V5a1 1 0 0 1 1-1h8a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-8a1 1 0 0 1-1-1v-2" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" />
      <path d="M4 12h10M10 8l4 4-4 4" stroke={stroke} strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function initials(name: string) {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
  return name.slice(0, 2).toUpperCase() || "U";
}

export function Sidebar({
  role,
  user,
  onLogout,
  mobileOpen = false,
  onCloseMobile,
}: {
  role: UserRole;
  user: UserAccount;
  onLogout: () => void;
  mobileOpen?: boolean;
  onCloseMobile?: () => void;
}) {
  const pathname = usePathname();
  const groups = navGroupsByRole[role];
  const [menuOpen, setMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const name =
    role === "admin" && (!user.fullName || displayName(user) === roleLabels.admin)
      ? "Admin User"
      : displayName(user);
  const avatar = initials(name);

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (!menuRef.current?.contains(e.target as Node)) setMenuOpen(false);
    }
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, []);

  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 flex h-screen shrink-0 flex-col overflow-hidden border-r border-[#e5ebf5] bg-white transition-transform duration-200 lg:static lg:translate-x-0 ${
        collapsed ? "w-[72px]" : "w-[268px]"
      } ${mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
    >
      {/* Navy brand header */}
      <div className={`bg-[#2f4d9a] py-4 text-white ${collapsed ? "px-3" : "px-4"}`}>
        {collapsed ? (
          <div className="mx-auto flex h-11 w-11 items-center justify-center overflow-hidden rounded-lg bg-white">
            <Image
              src="/navttc-logo.png"
              alt="NAVTTC"
              width={44}
              height={44}
              className="h-full w-full object-contain p-0.5"
            />
          </div>
        ) : (
          <div className="flex items-start gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white">
              <Image
                src="/navttc-logo.png"
                alt="NAVTTC"
                width={48}
                height={48}
                className="h-full w-full object-contain p-0.5"
              />
            </div>
            <div className="min-w-0 pt-0.5">
              <p className="text-[15px] font-semibold leading-snug">Job Portal Management System</p>
              <p className="mt-1 text-[11px] leading-snug text-blue-100">
                National Vocational &amp; Technical Training Commission
              </p>
            </div>
          </div>
        )}
      </div>

      {/* White / icon nav */}
      <nav className={`flex-1 overflow-y-auto py-3 ${collapsed ? "px-2" : "px-3"}`}>
        {groups.map((group, groupIndex) => (
          <div key={group.title} className={groupIndex > 0 ? "mt-2" : ""}>
            {collapsed ? (
              groupIndex > 0 ? (
                <div className="my-2 flex justify-center">
                  <span className="h-1.5 w-1.5 rounded-full border border-[#c5cedd]" />
                </div>
              ) : null
            ) : (
              <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.08em] text-[#c4a035]">
                {group.title}
              </p>
            )}
            <div className={`space-y-1 ${collapsed ? "flex flex-col items-center" : ""}`}>
              {group.items.map((item) => {
                const allHrefs = groups.flatMap((g) => g.items.map((i) => i.href));
                const matching = allHrefs.filter(
                  (h) => pathname === h || pathname.startsWith(`${h}/`)
                );
                const bestMatch = matching.sort((a, b) => b.length - a.length)[0];
                const active = bestMatch === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    title={item.label}
                    onClick={() => onCloseMobile?.()}
                    className={`flex items-center gap-3 rounded-lg text-[14px] font-medium transition ${
                      collapsed
                        ? `h-10 w-10 justify-center ${
                            active
                              ? "bg-[#e8eefc] text-[#2f4d9a]"
                              : "text-[#5b6b85] hover:bg-[#f3f6fb] hover:text-[#2f4d9a]"
                          }`
                        : `px-3 py-2.5 ${
                            active
                              ? "bg-[#e8eefc] text-[#2f4d9a]"
                              : "text-[#5b6b85] hover:bg-[#f3f6fb] hover:text-[#2f4d9a]"
                          }`
                    }`}
                  >
                    <NavIcon label={item.label} />
                    {!collapsed ? <span className="truncate">{item.label}</span> : null}
                    {!collapsed && item.label === "Dashboard" && active ? (
                      <span className="ml-auto rounded-full bg-[#2f4d9a] px-2 py-0.5 text-[10px] font-semibold text-white">
                        Live
                      </span>
                    ) : null}
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User footer + AMS-style popup */}
      <div className="relative border-t border-[#e5ebf5] bg-[#f4f7fc] p-2.5" ref={menuRef}>
        {menuOpen ? (
          <div
            className={`absolute z-50 w-[260px] overflow-hidden rounded-xl border border-[#e5ebf5] bg-white shadow-[0_12px_40px_rgba(15,30,60,0.18)] ${
              collapsed
                ? "bottom-3 left-[calc(100%+10px)]"
                : "bottom-[calc(100%+10px)] left-3 right-3 w-auto"
            }`}
          >
            <div className="flex flex-col items-center border-b border-[#eef2f7] px-5 pb-4 pt-5 text-center">
              <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[#e8eefc] text-[#2f4d9a]">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <circle cx="12" cy="8" r="3.5" stroke="currentColor" strokeWidth="1.7" />
                  <path
                    d="M4.5 19c2-3.5 4.5-5.2 7.5-5.2s5.5 1.7 7.5 5.2"
                    stroke="currentColor"
                    strokeWidth="1.7"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
              <p className="text-[15px] font-semibold text-[#1b2a4a]">{name}</p>
              <p className="mt-0.5 truncate text-[12px] text-[#6b7c99]">{user.email}</p>
              <p className="mt-1 text-[11px] text-[#8a94a6]">{roleLabels[role]}</p>
            </div>

            <div className="py-1">
              <Link
                href={profilePath(role)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#1b2a4a] hover:bg-[#f5f8fc]"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eefc]">
                  <MenuIcon kind="profile" />
                </span>
                Profile
              </Link>
              <div className="mx-4 border-t border-[#eef2f7]" />
              <Link
                href={changePasswordPath(role)}
                className="flex items-center gap-3 px-4 py-3 text-sm text-[#1b2a4a] hover:bg-[#f5f8fc]"
                onClick={() => setMenuOpen(false)}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eefc]">
                  <MenuIcon kind="password" />
                </span>
                Change Password
              </Link>
              <div className="mx-4 border-t border-[#eef2f7]" />
              <button
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm text-[#1b2a4a] hover:bg-[#f5f8fc]"
                onClick={() => {
                  setMenuOpen(false);
                  onLogout();
                }}
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#e8eefc]">
                  <MenuIcon kind="logout" />
                </span>
                Log Out
              </button>
            </div>
          </div>
        ) : null}

        <div className={`flex items-center ${collapsed ? "flex-col gap-2" : "gap-2"}`}>
          <button
            type="button"
            onClick={() => setMenuOpen((v) => !v)}
            className={`flex min-w-0 flex-1 items-center rounded-lg transition hover:bg-white/90 ${
              collapsed ? "h-10 w-10 justify-center p-0" : "gap-3 px-1.5 py-1.5 text-left"
            }`}
            aria-label="Open user menu"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#2f4d9a] text-[12px] font-semibold text-white">
              {avatar}
            </div>
            {!collapsed ? (
              <div className="min-w-0">
                <p className="truncate text-[13px] font-semibold text-[#1b2a4a]">{name}</p>
                <p className="truncate text-[11px] text-[#6b7c99]">{roleLabels[role]}</p>
              </div>
            ) : null}
          </button>

          <button
            type="button"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => {
              setMenuOpen(false);
              setCollapsed((v) => !v);
            }}
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-[#dbe3ef] bg-white text-[#5b6b85] hover:text-[#2f4d9a]"
          >
            <span className="text-xs font-semibold">{collapsed ? "»" : "«"}</span>
          </button>
        </div>
      </div>
    </aside>
  );
}
