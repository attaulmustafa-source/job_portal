"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import {
  buildReport,
  exportReportCsv,
  exportReportPdf,
  type ReportCatalogItem,
  type ReportContext,
  type ReportType,
} from "@/lib/reports";

/** Prefer these columns as dropdown filters when present */
const FILTER_KEYS_BY_REPORT: Partial<Record<ReportType, string[]>> = {
  seekers: ["city", "profile"],
  employers: ["category", "status"],
  jobs: ["type", "status", "location"],
  applications: ["status", "job"],
  placement: ["city", "active"],
  counselling: ["status", "center"],
  resumes: ["template"],
  registrations: ["role"],
};

export function ReportDetail({
  report,
  backHref,
  context,
}: {
  report: ReportCatalogItem;
  backHref: string;
  context: Omit<ReportContext, "dateFrom" | "dateTo" | "search">;
}) {
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");
  const [columnFilters, setColumnFilters] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<string>("");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const baseResult = useMemo(
    () =>
      buildReport(report.id as ReportType, {
        ...context,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
      }),
    [report.id, context, dateFrom, dateTo]
  );

  const filterKeys = useMemo(() => {
    const preferred = FILTER_KEYS_BY_REPORT[report.id] || [];
    return preferred.filter((key) => baseResult.columns.some((c) => c.key === key));
  }, [report.id, baseResult.columns]);

  const filterOptions = useMemo(() => {
    const map: Record<string, { value: string; label: string }[]> = {};
    for (const key of filterKeys) {
      const values = Array.from(
        new Set(
          baseResult.rows
            .map((r) => String(r[key] ?? "").trim())
            .filter(Boolean)
        )
      ).sort((a, b) => a.localeCompare(b));
      const col = baseResult.columns.find((c) => c.key === key);
      map[key] = [
        { value: "all", label: `All ${col?.label || key}` },
        ...values.map((v) => ({ value: v, label: v })),
      ];
    }
    return map;
  }, [filterKeys, baseResult.rows, baseResult.columns]);

  const filteredRows = useMemo(() => {
    const q = search.trim().toLowerCase();
    return baseResult.rows.filter((row) => {
      for (const key of filterKeys) {
        const selected = columnFilters[key] || "all";
        if (selected !== "all" && String(row[key] ?? "") !== selected) return false;
      }
      if (!q) return true;
      return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
    });
  }, [baseResult.rows, filterKeys, columnFilters, search]);

  const activeSortKey = sortKey || baseResult.columns[0]?.key || "";

  const sortedRows = useMemo(() => {
    if (!activeSortKey) return filteredRows;
    return [...filteredRows].sort((a, b) => {
      const av = String(a[activeSortKey] ?? "").toLowerCase();
      const bv = String(b[activeSortKey] ?? "").toLowerCase();
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredRows, activeSortKey, sortDir]);

  const exportResult = useMemo(
    () => ({
      ...baseResult,
      rows: sortedRows,
    }),
    [baseResult, sortedRows]
  );

  const totalPages = Math.max(1, Math.ceil(sortedRows.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = sortedRows.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: string) {
    if (activeSortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  function setFilter(key: string, value: string) {
    setColumnFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  }

  const fieldClass =
    "h-8 w-full rounded-md border border-[#dbe3ef] bg-white px-2.5 text-xs text-[#1b2a4a] outline-none focus:border-primary";

  return (
    <div>
      <PageHeader
        title={`${report.label} Report`}
        actions={
          <Link href={backHref}>
            <Button variant="secondary">← Back</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="space-y-2 border-b border-[#e5ebf5] p-3">
          {filterKeys.length ? (
            <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
              {filterKeys.map((key) => (
                <SearchableFilter
                  key={key}
                  value={columnFilters[key] || "all"}
                  onChange={(v) => setFilter(key, v)}
                  searchPlaceholder={`Search ${baseResult.columns.find((c) => c.key === key)?.label || key}...`}
                  options={filterOptions[key] || [{ value: "all", label: "All" }]}
                  className="min-w-0"
                />
              ))}
            </div>
          ) : null}

          <div className="flex flex-col gap-2 lg:flex-row lg:items-center">
            <input
              type="date"
              className={`${fieldClass} lg:max-w-[10.5rem]`}
              value={dateFrom}
              onChange={(e) => {
                setDateFrom(e.target.value);
                setPage(1);
              }}
              aria-label="Date from"
              title="Date from"
            />
            <input
              type="date"
              className={`${fieldClass} lg:max-w-[10.5rem]`}
              value={dateTo}
              onChange={(e) => {
                setDateTo(e.target.value);
                setPage(1);
              }}
              aria-label="Date to"
              title="Date to"
            />
            <div className="min-w-0 flex-1">
              <TableSearchInput
                value={search}
                onChange={(v) => {
                  setSearch(v);
                  setPage(1);
                }}
                placeholder="Search by name, email, CNIC, city..."
                className="sm:min-w-0"
              />
            </div>
            <div className="flex shrink-0 gap-2">
              <button
                type="button"
                title="Export PDF"
                onClick={() => exportReportPdf(exportResult)}
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#dc2626] text-white shadow-sm hover:bg-[#b91c1c]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="M14 2v6h6M8 13h8M8 17h5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
                <span className="sr-only">PDF</span>
              </button>
              <button
                type="button"
                title="Export Excel"
                onClick={() =>
                  exportReportCsv(
                    exportResult,
                    `${exportResult.title}-${new Date().toISOString().slice(0, 10)}`
                  )
                }
                className="inline-flex h-8 w-8 items-center justify-center rounded-md bg-[#16a34a] text-white shadow-sm hover:bg-[#15803d]"
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden>
                  <path
                    d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6Z"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinejoin="round"
                  />
                  <path d="M14 2v6h6M9 15l2.2-4 2.3 4M10 13h2.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span className="sr-only">Excel</span>
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-xs">
              <thead>
                <tr className="text-xs font-semibold">
                  {baseResult.columns.map((c) => (
                    <SortHeader
                      key={c.key}
                      label={c.label}
                      active={activeSortKey === c.key}
                      dir={sortDir}
                      onClick={() => toggleSort(c.key)}
                    />
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedRows.length === 0 ? (
                  <TableEmptyRow colSpan={baseResult.columns.length} />
                ) : (
                  paged.map((row, idx) => (
                    <tr key={idx} className="odd:bg-white even:bg-[#fafbfd]">
                      {baseResult.columns.map((c) => (
                        <td
                          key={c.key}
                          className="border border-[#e8eef6] px-2 py-1.5 align-top text-[#1b2a4a]"
                        >
                          {String(row[c.key] ?? "—")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

        <TablePagination
          total={sortedRows.length}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={(size) => {
            setPageSize(size);
            setPage(1);
          }}
        />
      </div>
    </div>
  );
}
