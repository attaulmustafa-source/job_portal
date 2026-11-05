"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge, appStatusTone } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import { APPLICATION_STATUSES } from "@/lib/jobs";
import type { ApplicationStatus } from "@/lib/types";

type StatusFilter = "all" | ApplicationStatus;
type SortKey = "job" | "company" | "status" | "applied";

export default function SeekerApplicationsPage() {
  const { user, jobs, applications } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("applied");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const mine = useMemo(
    () => applications.filter((a) => a.seekerId === user?.id),
    [applications, user?.id]
  );

  const filtered = useMemo(() => {
    function sortValue(app: (typeof mine)[number], key: SortKey) {
      const job = jobs.find((j) => j.id === app.jobId);
      switch (key) {
        case "job":
          return (job?.title || "").toLowerCase();
        case "company":
          return (job?.company || "").toLowerCase();
        case "status":
          return app.status.toLowerCase();
        case "applied":
          return app.appliedAt || "";
        default:
          return "";
      }
    }

    const rows = mine.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      const job = jobs.find((j) => j.id === app.jobId);
      const hay = `${job?.title || ""} ${job?.company || ""} ${app.status}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [mine, jobs, search, statusFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, pageSize, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "applied" ? "desc" : "asc");
  }

  return (
    <div>
      <PageHeader
        title="Applications"
        actions={
          <Link href="/seeker/jobs">
            <Button>+ Browse Jobs</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Applications List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              searchPlaceholder="Search statuses..."
              options={[
                { value: "all", label: "All statuses" },
                ...APPLICATION_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search applications..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Job"
                  active={sortKey === "job"}
                  dir={sortDir}
                  onClick={() => toggleSort("job")}
                />
                <SortHeader
                  label="Company"
                  active={sortKey === "company"}
                  dir={sortDir}
                  onClick={() => toggleSort("company")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortHeader
                  label="Applied"
                  active={sortKey === "applied"}
                  dir={sortDir}
                  onClick={() => toggleSort("applied")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={5} />
              ) : (
                paged.map((app, index) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const lastHistory = app.history?.[app.history.length - 1];
                return (
                  <tr
                    key={app.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">
                      {job?.title || "—"}
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{job?.company || "—"}</td>
                    <td className="px-2 py-1.5">
                      <StatusBadge label={app.status} tone={appStatusTone(app.status)} />
                      {lastHistory && lastHistory.status !== app.status ? (
                        <span className="mt-0.5 block text-[10px] text-[#6b7c99]">
                          Was {lastHistory.status}
                        </span>
                      ) : null}
                    </td>
                    <td className="whitespace-nowrap px-2 py-1.5 text-[#5b6b85]">
                      {new Date(app.appliedAt).toLocaleString()}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          {
                            label: "View job",
                            href: job ? `/seeker/jobs/${job.id}` : "/seeker/jobs",
                          },
                        ]}
                      />
                    </td>
                  </tr>
                );
              })
              )}
            </tbody>
          </table>

        <TablePagination
          total={filtered.length}
          page={currentPage}
          pageSize={pageSize}
          onPageChange={setPage}
          onPageSizeChange={setPageSize}
        />
      </div>
    </div>
  );
}
