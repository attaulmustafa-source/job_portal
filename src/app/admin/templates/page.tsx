"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import type { ResumeTemplate, ResumeTemplateStyle } from "@/lib/types";

type StatusFilter = "all" | "Active" | "In-Active";
type StyleFilter = "all" | ResumeTemplateStyle;
type SortKey = "name" | "style" | "status" | "updated";

const STYLES: ResumeTemplateStyle[] = ["classic", "modern", "compact"];

function statusLabel(tpl: ResumeTemplate) {
  return tpl.active ? "Active" : "In-Active";
}

function sortValue(tpl: ResumeTemplate, key: SortKey) {
  switch (key) {
    case "name":
      return tpl.name.toLowerCase();
    case "style":
      return tpl.style.toLowerCase();
    case "status":
      return statusLabel(tpl);
    case "updated":
      return tpl.updatedAt || tpl.createdAt || "";
    default:
      return "";
  }
}

export default function AdminTemplatesPage() {
  const { resumeTemplates, updateResumeTemplate, deleteResumeTemplate } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [styleFilter, setStyleFilter] = useState<StyleFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const filtered = useMemo(() => {
    const rows = resumeTemplates.filter((tpl) => {
      const status = statusLabel(tpl);
      if (statusFilter === "Active" && status !== "Active") return false;
      if (statusFilter === "In-Active" && status !== "In-Active") return false;
      if (styleFilter !== "all" && tpl.style !== styleFilter) return false;
      const hay = `${tpl.name} ${tpl.description} ${tpl.style}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [resumeTemplates, search, statusFilter, styleFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, styleFilter, pageSize, sortKey, sortDir]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const currentPage = Math.min(page, totalPages);
  const paged = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  function toggleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
      return;
    }
    setSortKey(key);
    setSortDir(key === "updated" ? "desc" : "asc");
  }

  return (
    <div>
      <PageHeader
        title="Resume Templates"
        actions={
          <Link href="/admin/templates/new">
            <Button>+ Create Template</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Templates List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              searchPlaceholder="Search statuses..."
              options={[
                { value: "all", label: "All statuses" },
                { value: "Active", label: "Active" },
                { value: "In-Active", label: "In-Active" },
              ]}
            />
            <SearchableFilter
              value={styleFilter}
              onChange={(v) => setStyleFilter(v as StyleFilter)}
              searchPlaceholder="Search styles..."
              options={[
                { value: "all", label: "All styles" },
                ...STYLES.map((s) => ({
                  value: s,
                  label: s.charAt(0).toUpperCase() + s.slice(1),
                })),
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search templates..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Name"
                  active={sortKey === "name"}
                  dir={sortDir}
                  onClick={() => toggleSort("name")}
                />
                <SortHeader
                  label="Style"
                  active={sortKey === "style"}
                  dir={sortDir}
                  onClick={() => toggleSort("style")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortHeader
                  label="Updated"
                  active={sortKey === "updated"}
                  dir={sortDir}
                  onClick={() => toggleSort("updated")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={5} />
              ) : (
                paged.map((tpl, index) => (
                <tr
                  key={tpl.id}
                  className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                    index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                  }`}
                >
                  <td className="px-2 py-1.5">
                    <div className="font-medium text-[#1b2a4a]">{tpl.name}</div>
                    <div className="mt-0.5 line-clamp-1 text-xs text-[#6b7c99]">
                      {tpl.description}
                    </div>
                  </td>
                  <td className="px-2 py-1.5">
                    <StatusBadge
                      label={tpl.style.charAt(0).toUpperCase() + tpl.style.slice(1)}
                      tone="info"
                    />
                  </td>
                  <td className="px-2 py-1.5">
                    <StatusBadge
                      label={statusLabel(tpl)}
                      tone={tpl.active ? "success" : "neutral"}
                    />
                  </td>
                  <td className="px-2 py-1.5 text-[#5b6b85]">
                    {new Date(tpl.updatedAt || tpl.createdAt).toLocaleDateString()}
                  </td>
                  <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                    <ActionsMenu
                      items={[
                        {
                          label: tpl.active ? "Deactivate" : "Activate",
                          onClick: () =>
                            updateResumeTemplate(tpl.id, { active: !tpl.active }),
                        },
                        {
                          label: "Delete",
                          tone: "danger",
                          onClick: () => {
                            if (confirm(`Delete template "${tpl.name}"?`)) {
                              alert(deleteResumeTemplate(tpl.id).message);
                            }
                          },
                        },
                      ]}
                    />
                  </td>
                </tr>
              ))
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
