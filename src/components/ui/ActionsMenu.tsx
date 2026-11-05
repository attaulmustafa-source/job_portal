"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";

export type ActionsMenuItem =
  | {
      label: string;
      href: string;
      tone?: "default" | "danger" | "warning";
      icon?: ReactNode;
    }
  | {
      label: string;
      onClick: () => void;
      tone?: "default" | "danger" | "warning";
      icon?: ReactNode;
    };

function IconEdit() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M12 20h9M16.5 3.5a2.1 2.1 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconView() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function IconDelete() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconPlusCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M12 8v8M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconMinusCircle() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.7" />
      <path d="M8 12h8" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    </svg>
  );
}

function IconCheck() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M20 6 9 17l-5-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconX() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M18 6 6 18M6 6l12 12"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  );
}

function IconMail() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M4 6h16v12H4V6Zm0 0 8 7 8-7"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconBriefcase() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M3 7h18v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconRefresh() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M21 12a9 9 0 1 1-2.6-6.3M21 4v5h-5"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconFile() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <path
        d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinejoin="round"
      />
      <path d="M14 2v6h6" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  );
}

function IconDot() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
      <circle cx="12" cy="12" r="3.5" stroke="currentColor" strokeWidth="1.7" />
    </svg>
  );
}

function iconForLabel(label: string): ReactNode {
  const key = label.trim().toLowerCase();
  if (key.includes("edit")) return <IconEdit />;
  if (key.includes("view cv") || key.includes("preview") || key.includes("cv")) return <IconFile />;
  if (key === "view" || key.startsWith("view ")) return <IconView />;
  if (key.includes("delete") || key.includes("remove")) return <IconDelete />;
  if (key.includes("in-active") || key.includes("inactive") || key.includes("unpublish"))
    return <IconMinusCircle />;
  if (key.includes("activate") || key.includes("publish") || key.includes("approve"))
    return <IconPlusCircle />;
  if (key.includes("reject")) return <IconX />;
  if (key.includes("shortlist") || key.includes("selected") || key.includes("under review"))
    return <IconCheck />;
  if (key.includes("mark read") || key.includes("open")) return <IconMail />;
  if (key.includes("post job") || key.includes("job")) return <IconBriefcase />;
  if (key.includes("request") || key.includes("again")) return <IconRefresh />;
  return <IconDot />;
}

export function ActionsMenu({ items, label = "Actions" }: { items: ActionsMenuItem[]; label?: string }) {
  const [open, setOpen] = useState(false);
  const [coords, setCoords] = useState<{ top: number; left: number } | null>(null);
  const [mounted, setMounted] = useState(false);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    setMounted(true);
  }, []);

  function updatePosition() {
    const btn = buttonRef.current;
    if (!btn) return;
    const rect = btn.getBoundingClientRect();
    const menuWidth = menuRef.current?.offsetWidth || 160;
    const left = Math.min(
      Math.max(8, rect.right - menuWidth),
      window.innerWidth - menuWidth - 8
    );
    setCoords({ top: rect.bottom + 4, left });
  }

  useLayoutEffect(() => {
    if (!open) return;
    updatePosition();
    function onReposition() {
      updatePosition();
    }
    window.addEventListener("resize", onReposition);
    window.addEventListener("scroll", onReposition, true);
    return () => {
      window.removeEventListener("resize", onReposition);
      window.removeEventListener("scroll", onReposition, true);
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    function onPointerDown(e: MouseEvent) {
      const target = e.target as Node;
      if (buttonRef.current?.contains(target) || menuRef.current?.contains(target)) return;
      setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const itemClass = (tone?: ActionsMenuItem["tone"]) => {
    if (tone === "danger") return "text-danger hover:bg-red-50";
    if (tone === "warning") return "text-warning hover:bg-amber-50";
    return "text-[#1b2a4a] hover:bg-[#f1f5fb]";
  };

  function renderItemContent(item: ActionsMenuItem) {
    return (
      <span className="inline-flex items-center gap-2">
        <span className="inline-flex shrink-0 opacity-90">{item.icon ?? iconForLabel(item.label)}</span>
        <span>{item.label}</span>
      </span>
    );
  }

  const menu =
    open && mounted && coords
      ? createPortal(
          <div
            ref={menuRef}
            id={menuId}
            role="menu"
            style={{ top: coords.top, left: coords.left }}
            className="fixed z-[80] min-w-[10.5rem] overflow-hidden rounded-lg border border-[#e5ebf5] bg-white py-1 shadow-[0_10px_28px_rgba(15,30,60,0.16)]"
          >
            {items.map((item) =>
              "href" in item ? (
                <Link
                  key={item.label}
                  href={item.href}
                  role="menuitem"
                  className={`block px-3 py-2.5 text-sm ${itemClass(item.tone)}`}
                  onClick={() => setOpen(false)}
                >
                  {renderItemContent(item)}
                </Link>
              ) : (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className={`block w-full px-3 py-2.5 text-left text-sm ${itemClass(item.tone)}`}
                  onClick={() => {
                    setOpen(false);
                    item.onClick();
                  }}
                >
                  {renderItemContent(item)}
                </button>
              )
            )}
          </div>,
          document.body
        )
      : null;

  return (
    <div className="inline-block text-left">
      <button
        ref={buttonRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={menuId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex items-center gap-1 rounded bg-primary px-2 py-1 text-xs font-medium text-white hover:bg-primary-hover"
      >
        {label}
        <svg
          width="14"
          height="14"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className={`transition ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M5 7.5 10 12.5 15 7.5"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
      {menu}
    </div>
  );
}
