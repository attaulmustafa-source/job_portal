"use client";

export function ListToolbar({
  search,
  onSearch,
  placeholder = "Search...",
  right,
}: {
  search: string;
  onSearch: (value: string) => void;
  placeholder?: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="mb-4 flex flex-col gap-3 rounded-xl border border-[#e5ebf5] bg-white p-3 shadow-sm sm:flex-row sm:items-center sm:justify-between">
      <input
        className="w-full rounded-lg border border-[#dbe3ef] bg-[#f8fafc] px-3 py-2.5 text-sm outline-none focus:border-[#2f4d9a] sm:max-w-sm"
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder={placeholder}
      />
      {right ? <div className="flex flex-wrap gap-2">{right}</div> : null}
    </div>
  );
}
