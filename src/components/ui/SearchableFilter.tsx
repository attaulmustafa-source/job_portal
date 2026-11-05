"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";

export type FilterOption = { value: string; label: string };

export function SearchableFilter({
  value,
  onChange,
  options,
  searchPlaceholder = "Search...",
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  options: FilterOption[];
  searchPlaceholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listId = useId();

  const selected = options.find((o) => o.value === value) || options[0];
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((o) => o.label.toLowerCase().includes(q));
  }, [options, query]);

  useEffect(() => {
    if (!open) {
      setQuery("");
      return;
    }
    const t = window.setTimeout(() => inputRef.current?.focus(), 0);
    function onPointerDown(e: MouseEvent) {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKey);
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className={`relative ${className}`} ref={rootRef}>
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={open}
        aria-controls={listId}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-full min-w-[8.5rem] items-center justify-between gap-1.5 rounded-md border border-[#dbe3ef] bg-white px-2.5 text-left text-xs text-[#1b2a4a] hover:border-[#b8c5da]"
      >
        <span className="truncate">{selected?.label || "Select"}</span>
        <svg
          width="16"
          height="16"
          viewBox="0 0 20 20"
          fill="none"
          aria-hidden
          className={`shrink-0 text-[#6b7c99] transition ${open ? "rotate-180" : ""}`}
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

      {open ? (
        <div
          id={listId}
          role="listbox"
          className="absolute left-0 z-40 mt-1 w-full min-w-[14rem] overflow-hidden rounded-lg border border-[#e5ebf5] bg-white shadow-[0_12px_32px_rgba(15,30,60,0.14)]"
        >
          <div className="border-b border-[#eef2f7] p-2">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full rounded-md border border-[#dbe3ef] bg-[#f8fafc] px-2.5 py-1.5 text-sm outline-none focus:border-primary"
            />
          </div>
          <ul className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-2 text-sm text-[#6b7c99]">No matches</li>
            ) : (
              filtered.map((opt) => {
                const active = opt.value === value;
                return (
                  <li key={opt.value}>
                    <button
                      type="button"
                      role="option"
                      aria-selected={active}
                      className="block w-full px-3 py-2 text-left text-sm text-[#1b2a4a] hover:bg-[#f1f5fb]"
                      onClick={() => {
                        onChange(opt.value);
                        setOpen(false);
                      }}
                    >
                      {opt.label}
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      ) : null}
    </div>
  );
}

export function TableSearchInput({
  value,
  onChange,
  placeholder,
  className = "",
}: {
  value: string;
  onChange: (value: string) => void;
  placeholder: string;
  className?: string;
}) {
  return (
    <label className={`relative block sm:min-w-[12rem] ${className}`}>
      <span className="pointer-events-none absolute inset-y-0 left-2.5 flex items-center text-[#8a9bb5]">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden>
          <circle cx="11" cy="11" r="6.5" stroke="currentColor" strokeWidth="1.8" />
          <path d="M16.5 16.5 20 20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
        </svg>
      </span>
      <input
        className="h-8 w-full rounded-md border border-[#dbe3ef] bg-white py-0 pl-8 pr-2.5 text-xs text-[#1b2a4a] outline-none focus:border-primary"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
      />
    </label>
  );
}
