"use client";

const PAGE_SIZE_OPTIONS = [10, 25, 50];

export function TablePagination({
  total,
  page,
  pageSize,
  onPageChange,
  onPageSizeChange,
}: {
  total: number;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
}) {
  if (total <= 0) return null;

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const current = Math.min(Math.max(1, page), totalPages);
  const from = (current - 1) * pageSize + 1;
  const to = Math.min(current * pageSize, total);

  const pages: number[] = [];
  const windowStart = Math.max(1, current - 2);
  const windowEnd = Math.min(totalPages, windowStart + 4);
  for (let p = windowStart; p <= windowEnd; p++) pages.push(p);

  const navBtn =
    "inline-flex h-7 min-w-7 items-center justify-center rounded bg-primary px-1.5 text-xs font-medium text-white disabled:cursor-not-allowed disabled:opacity-40 hover:bg-primary-hover";

  return (
    <div className="flex flex-col gap-2 border-t border-[#e5ebf5] bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-xs text-[#5b6b85]">
        Showing <span className="font-medium text-[#1b2a4a]">{from}</span> to{" "}
        <span className="font-medium text-[#1b2a4a]">{to}</span> of{" "}
        <span className="font-medium text-[#1b2a4a]">{total}</span> rows.
      </p>
      <div className="flex flex-wrap items-center gap-1.5">
        <label className="flex items-center gap-1.5 text-xs text-[#5b6b85]">
          <span className="sr-only">Rows per page</span>
          <select
            className="h-7 rounded border border-[#dbe3ef] bg-white px-1.5 text-xs text-[#1b2a4a] outline-none focus:border-primary"
            value={pageSize}
            onChange={(e) => onPageSizeChange(Number(e.target.value))}
          >
            {PAGE_SIZE_OPTIONS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-center gap-1">
          <button
            type="button"
            className={navBtn}
            disabled={current <= 1}
            onClick={() => onPageChange(1)}
            aria-label="First page"
          >
            |&lt;
          </button>
          <button
            type="button"
            className={navBtn}
            disabled={current <= 1}
            onClick={() => onPageChange(current - 1)}
            aria-label="Previous page"
          >
            &lt;
          </button>
          {pages.map((p) => (
            <button
              key={p}
              type="button"
              className={`${navBtn} ${p === current ? "ring-2 ring-offset-1 ring-[#93a8d8]" : ""}`}
              onClick={() => onPageChange(p)}
              aria-current={p === current ? "page" : undefined}
            >
              {p}
            </button>
          ))}
          <button
            type="button"
            className={navBtn}
            disabled={current >= totalPages}
            onClick={() => onPageChange(current + 1)}
            aria-label="Next page"
          >
            &gt;
          </button>
          <button
            type="button"
            className={navBtn}
            disabled={current >= totalPages}
            onClick={() => onPageChange(totalPages)}
            aria-label="Last page"
          >
            &gt;|
          </button>
        </div>
      </div>
    </div>
  );
}
