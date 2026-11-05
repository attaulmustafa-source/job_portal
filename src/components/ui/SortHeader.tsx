"use client";

export type SortDir = "asc" | "desc";

export function SortHeader({
  label,
  active,
  dir,
  onClick,
}: {
  label: string;
  active: boolean;
  dir: SortDir;
  onClick: () => void;
}) {
  const idle = "text-[#9aa6bc]";
  const activeColor = "text-[#2f4d9a]";

  return (
    <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 transition-colors hover:!bg-[#374151]">
      <button
        type="button"
        onClick={onClick}
        className="inline-flex w-full cursor-pointer items-center gap-2 bg-transparent px-2 py-1.5 text-left text-[11px] font-semibold uppercase tracking-wide text-black transition-colors hover:!bg-[#374151] hover:!text-black"
      >
        {label}
        {/* Side-by-side ↑ ↓ — matches registry header style */}
        <span className="inline-flex items-center" aria-hidden>
          <svg width="12" height="11" viewBox="0 0 12 11" fill="none">
            <path
              d="M3 9.2V1.8M3 1.8 1 4M3 1.8 5 4"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={active && dir === "asc" ? activeColor : idle}
            />
            <path
              d="M9 1.8v7.4M9 9.2 7 7M9 9.2 11 7"
              stroke="currentColor"
              strokeWidth="1.25"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={active && dir === "desc" ? activeColor : idle}
            />
          </svg>
        </span>
        <span className="sr-only">
          {active ? (dir === "asc" ? "sorted ascending" : "sorted descending") : "sortable"}
        </span>
      </button>
    </th>
  );
}
