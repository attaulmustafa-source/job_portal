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

type SortKey = "title" | "template" | "style" | "updated";

export default function SeekerResumesPage() {
  const { user, resumeTemplates, resumes, deleteResume } = useAuth();
  const [search, setSearch] = useState("");
  const [templateFilter, setTemplateFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("updated");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const mine = useMemo(
    () => resumes.filter((r) => r.seekerId === user?.id),
    [resumes, user?.id]
  );

  const templateOptions = useMemo(() => {
    const used = new Set(mine.map((r) => r.templateId));
    return resumeTemplates
      .filter((t) => used.has(t.id))
      .map((t) => ({ value: t.id, label: t.name }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [mine, resumeTemplates]);

  const filtered = useMemo(() => {
    function sortValue(resume: (typeof mine)[number], key: SortKey) {
      const tpl = resumeTemplates.find((t) => t.id === resume.templateId);
      switch (key) {
        case "title":
          return resume.title.toLowerCase();
        case "template":
          return (tpl?.name || "").toLowerCase();
        case "style":
          return (tpl?.style || "").toLowerCase();
        case "updated":
          return resume.updatedAt || "";
        default:
          return "";
      }
    }

    const rows = mine.filter((resume) => {
      if (templateFilter !== "all" && resume.templateId !== templateFilter) return false;
      const tpl = resumeTemplates.find((t) => t.id === resume.templateId);
      const hay = `${resume.title} ${tpl?.name || ""} ${tpl?.style || ""}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [mine, resumeTemplates, search, templateFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, templateFilter, pageSize, sortKey, sortDir]);

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
        title="Resumes"
        actions={
          <Link href="/seeker/resumes/new">
            <Button>+ Create Resume</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Resumes List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={templateFilter}
              onChange={setTemplateFilter}
              searchPlaceholder="Search templates..."
              options={[
                { value: "all", label: "All templates" },
                ...templateOptions,
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search resumes..."
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
                  label="Template"
                  active={sortKey === "template"}
                  dir={sortDir}
                  onClick={() => toggleSort("template")}
                />
                <SortHeader
                  label="Style"
                  active={sortKey === "style"}
                  dir={sortDir}
                  onClick={() => toggleSort("style")}
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
                paged.map((resume, index) => {
                const tpl = resumeTemplates.find((t) => t.id === resume.templateId);
                return (
                  <tr
                    key={resume.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">{resume.title}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{tpl?.name || "—"}</td>
                    <td className="px-2 py-1.5">
                      {tpl ? (
                        <StatusBadge
                          label={tpl.style.charAt(0).toUpperCase() + tpl.style.slice(1)}
                          tone="info"
                        />
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="whitespace-nowrap px-2 py-1.5 text-[#5b6b85]">
                      {new Date(resume.updatedAt).toLocaleString()}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          { label: "Edit", href: `/seeker/resumes/${resume.id}` },
                          {
                            label: "Preview",
                            href: `/seeker/resumes/${resume.id}?tab=preview`,
                          },
                          {
                            label: "Delete",
                            tone: "danger",
                            onClick: () => {
                              if (confirm(`Delete resume "${resume.title}"?`)) {
                                alert(deleteResume(resume.id).message);
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
