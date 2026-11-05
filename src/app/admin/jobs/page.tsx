"use client";

import { useEffect, useMemo, useState } from "react";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge } from "@/components/jobs/CategoryBadge";
import { StatusBadge, jobStatusTone } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import { daysUntilExpiry, EMPLOYER_CATEGORIES, isJobActive } from "@/lib/jobs";
import type { EmployerCategory, JobPosting } from "@/lib/types";

type CategoryFilter = "all" | EmployerCategory;
type StatusFilter = "all" | "Active" | "Expired" | "Unpublished";
type SortKey = "title" | "company" | "location" | "category" | "type" | "status" | "expiry";

function statusLabel(job: JobPosting) {
  if (isJobActive(job)) return "Active";
  if (job.status === "expired" || (job.status === "published" && !isJobActive(job))) return "Expired";
  if (job.status === "unpublished") return "Unpublished";
  return job.status;
}

function sortValue(job: JobPosting, key: SortKey) {
  switch (key) {
    case "title":
      return job.title.toLowerCase();
    case "company":
      return job.company.toLowerCase();
    case "location":
      return job.location.toLowerCase();
    case "category":
      return job.category;
    case "type":
      return job.type.toLowerCase();
    case "status":
      return statusLabel(job);
    case "expiry":
      return job.expiryDate || "";
    default:
      return "";
  }
}

export default function AdminJobsPage() {
  const { jobs, deleteJob } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>("all");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("title");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const rows = jobs.filter((job) => {
      if (category !== "all" && job.category !== category) return false;
      const label = statusLabel(job);
      if (statusFilter === "Active" && label !== "Active") return false;
      if (statusFilter === "Expired" && label !== "Expired") return false;
      if (statusFilter === "Unpublished" && label !== "Unpublished") return false;
      const hay = `${job.title} ${job.company} ${job.location} ${job.category} ${job.type}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [jobs, search, category, statusFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, category, statusFilter, pageSize, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir("asc");
  }

  return (
    <div>
      <PageHeader title="Jobs" />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Jobs List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              searchPlaceholder="Search statuses..."
              options={[
                { value: "all", label: "All statuses" },
                { value: "Active", label: "Active" },
                { value: "Expired", label: "Expired" },
                { value: "Unpublished", label: "Unpublished" },
              ]}
            />
            <SearchableFilter
              value={category}
              onChange={(v) => setCategory(v as CategoryFilter)}
              searchPlaceholder="Search categories..."
              options={[
                { value: "all", label: "All categories" },
                ...EMPLOYER_CATEGORIES.map((c) => ({ value: c, label: c })),
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search jobs..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Title"
                  active={sortKey === "title"}
                  dir={sortDir}
                  onClick={() => toggleSort("title")}
                />
                <SortHeader
                  label="Company"
                  active={sortKey === "company"}
                  dir={sortDir}
                  onClick={() => toggleSort("company")}
                />
                <SortHeader
                  label="Location"
                  active={sortKey === "location"}
                  dir={sortDir}
                  onClick={() => toggleSort("location")}
                />
                <SortHeader
                  label="Category"
                  active={sortKey === "category"}
                  dir={sortDir}
                  onClick={() => toggleSort("category")}
                />
                <SortHeader
                  label="Type"
                  active={sortKey === "type"}
                  dir={sortDir}
                  onClick={() => toggleSort("type")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortHeader
                  label="Expiry"
                  active={sortKey === "expiry"}
                  dir={sortDir}
                  onClick={() => toggleSort("expiry")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={8} />
              ) : (
                paged.map((job, index) => {
                const active = isJobActive(job);
                const label = statusLabel(job);
                return (
                  <tr
                    key={job.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">{job.title}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{job.company}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{job.location}</td>
                    <td className="px-2 py-1.5">
                      <CategoryBadge category={job.category} />
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge label={job.type} tone="info" />
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={label}
                        tone={jobStatusTone(active ? "published" : job.status)}
                      />
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {job.expiryDate}
                      {active ? (
                        <span className="block text-xs text-[#6b7c99]">
                          {daysUntilExpiry(job.expiryDate)} day(s) left
                        </span>
                      ) : null}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          { label: "View", href: `/admin/jobs/${job.id}` },
                          {
                            label: "Delete",
                            tone: "danger",
                            onClick: () => {
                              if (
                                confirm(
                                  `Delete job "${job.title}"? Related applications will also be removed.`
                                )
                              ) {
                                alert(deleteJob(job.id).message);
                              }
                            },
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
