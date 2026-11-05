"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

function getScrollTarget(): HTMLElement | Window {
  const main = document.getElementById("app-main-scroll");
  if (main) return main;
  const overflowMain = document.querySelector<HTMLElement>("main.overflow-y-auto");
  if (overflowMain) return overflowMain;
  return window;
}

function readScrollTop(target: HTMLElement | Window) {
  if (target instanceof HTMLElement) return target.scrollTop;
  return window.scrollY || document.documentElement.scrollTop || 0;
}

export function ScrollToTop() {
  const [ready, setReady] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;

    let target: HTMLElement | Window = window;

    function onScroll() {
      setVisible(readScrollTop(target) > 80);
    }

    function bind() {
      target.removeEventListener("scroll", onScroll);
      target = getScrollTarget();
      onScroll();
      target.addEventListener("scroll", onScroll, { passive: true });
    }

    bind();
    const t = window.setTimeout(bind, 100);

    return () => {
      window.clearTimeout(t);
      target.removeEventListener("scroll", onScroll);
    };
  }, [ready]);

  function goTop() {
    const target = getScrollTarget();
    if (target instanceof HTMLElement) {
      target.scrollTo({ top: 0, behavior: "smooth" });
      return;
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  if (!ready || !visible || typeof document === "undefined") return null;

  return createPortal(
    <button
      id="scroll-to-top-btn"
      type="button"
      onClick={goTop}
      aria-label="Scroll to top"
      title="Back to top"
      style={{
        position: "fixed",
        right: 24,
        bottom: 72,
        zIndex: 2147483647,
        width: 44,
        height: 44,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 8,
        border: "1px solid #2f4d9a",
        backgroundColor: "#e5e7eb",
        color: "#2f4d9a",
        cursor: "pointer",
        boxShadow: "0 6px 18px rgba(15, 30, 60, 0.28)",
        padding: 0,
        margin: 0,
      }}
    >
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
        <path
          d="M12 19V5M12 5l-6 6M12 5l6 6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </button>,
    document.body
  );
}
