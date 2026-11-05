"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

const SOFT_NAV_KEY = "navttc-soft-nav";

let softNavGateReady = false;

function initSoftNavGate() {
  if (typeof window === "undefined" || softNavGateReady) return;
  softNavGateReady = true;
  // Only on hard load / refresh — clear so home can animate once for this document
  const nav = performance.getEntriesByType("navigation")[0] as
    | PerformanceNavigationTiming
    | undefined;
  if (nav?.type === "reload" || nav?.type === "navigate") {
    try {
      sessionStorage.removeItem(SOFT_NAV_KEY);
    } catch {
      /* ignore */
    }
  }
}

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/success-stories", label: "Success Stories" },
  { href: "/events", label: "Events" },
  { href: "/career-advisors", label: "Career Advisors" },
  { href: "/about", label: "About Us" },
  { href: "/contact", label: "Contact Us" },
] as const;

const btnLogin =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-md bg-[#2f4d9a] px-3 text-xs font-medium !text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#263f82] hover:!text-white xl:h-10 xl:px-4 xl:text-sm";
const btnLight =
  "inline-flex h-9 shrink-0 items-center justify-center rounded-md border border-transparent bg-[#e8eef8] px-3 text-xs font-medium !text-[#2f4d9a] transition-all duration-300 hover:-translate-y-1 hover:border-[#2f4d9a] hover:bg-[#2f4d9a] hover:!text-white xl:h-10 xl:px-4 xl:text-sm";

function markSoftNavigation() {
  try {
    sessionStorage.setItem(SOFT_NAV_KEY, "1");
  } catch {
    /* ignore */
  }
}

export function LandingHeader() {
  const [open, setOpen] = useState(false);
  const [animateOpen, setAnimateOpen] = useState(false);

  useEffect(() => {
    initSoftNavGate();

    // Track in-app clicks so Home / other links do not re-animate the header
    function onDocClick(e: MouseEvent) {
      const anchor = (e.target as HTMLElement | null)?.closest("a");
      if (!anchor) return;
      try {
        const url = new URL(anchor.href, window.location.href);
        if (url.origin === window.location.origin) markSoftNavigation();
      } catch {
        /* ignore */
      }
    }
    document.addEventListener("click", onDocClick, true);

    let soft = false;
    try {
      soft = sessionStorage.getItem(SOFT_NAV_KEY) === "1";
    } catch {
      soft = false;
    }
    if (window.location.pathname === "/" && !soft) {
      setAnimateOpen(true);
    }

    return () => document.removeEventListener("click", onDocClick, true);
  }, []);

  return (
    <header className="sticky top-0 z-40 overflow-hidden border-b border-[#e8eef3] bg-white">
      <div
        className={`mx-auto flex min-h-[88px] max-w-[1280px] items-center gap-4 px-4 sm:px-6 lg:gap-6 ${
          animateOpen ? "header-enter-x" : ""
        }`}
      >
        {/* Left — brand */}
        <div className="flex min-w-0 shrink-0 justify-start">
          <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            <span className="relative flex h-12 w-12 shrink-0 overflow-hidden rounded-full bg-white sm:h-14 sm:w-14">
              <Image
                src="/navttc-logo.png"
                alt="NAVTTC"
                width={56}
                height={56}
                className="h-full w-full object-contain"
                priority
              />
            </span>
            <span className="min-w-0 truncate text-sm font-semibold text-[#0f2a3d] sm:text-[15px]">
              Job Portal
            </span>
          </Link>
        </div>

        {/* Center — menu items (desktop) */}
        <nav
          className="hidden min-w-0 flex-1 items-center justify-center gap-0.5 whitespace-nowrap lg:flex xl:gap-1"
          aria-label="Primary"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="px-2 py-2 text-[13px] font-medium text-[#1b2a4a] hover:text-black xl:px-2.5 xl:text-sm"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Right — actions; ml keeps clear space after Contact Us */}
        <div className="ml-auto flex shrink-0 items-center justify-end gap-2 lg:ml-12 xl:ml-16">
          <div className="hidden items-center justify-end gap-2 whitespace-nowrap md:flex">
            <Link href="/login" className={btnLogin}>
              Log in
            </Link>
            <Link href="/register" className={btnLight}>
              Register as Job Seeker or Employer
            </Link>
          </div>
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-md border border-[#dbe3ef] text-[#1b2a4a] lg:hidden"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
              {open ? (
                <path
                  d="M6 6l12 12M18 6 6 18"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              ) : (
                <path
                  d="M4 7h16M4 12h16M4 17h16"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {open ? (
        <div
          id="landing-mobile-nav"
          className="border-t border-[#e5ebf5] bg-white px-4 py-3 lg:hidden"
        >
          <nav className="flex flex-col gap-1" aria-label="Mobile">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-[#1b2a4a] hover:bg-[#f5f8fc] hover:text-black"
                onClick={() => setOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="mt-3 flex flex-col gap-2 border-t border-[#eef2f7] pt-3 md:hidden">
              <Link href="/login" className={btnLogin} onClick={() => setOpen(false)}>
                Log in
              </Link>
              <Link href="/register" className={btnLight} onClick={() => setOpen(false)}>
                Register as Job Seeker or Employer
              </Link>
            </div>
          </nav>
        </div>
      ) : null}
    </header>
  );
}
