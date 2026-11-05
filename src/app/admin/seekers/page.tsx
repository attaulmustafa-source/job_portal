"use client";

import { useEffect, useMemo, useState } from "react";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import { isSeekerProfileComplete, seekerRegistryType } from "@/lib/profile";
import type { UserAccount } from "@/lib/types";

type TypeFilter = "all" | "Internal" | "External";
type SortKey = "name" | "email" | "city" | "type" | "profile";

function sortValue(seeker: UserAccount, key: SortKey) {
  switch (key) {
    case "name":
      return (seeker.seekerProfile?.fullName || "").toLowerCase();
    case "email":
      return seeker.email.toLowerCase();
    case "city":
      return (seeker.seekerProfile?.city || "").toLowerCase();
    case "type":
      return seekerRegistryType(seeker.seekerProfile);
    case "profile":
      return isSeekerProfileComplete(seeker.seekerProfile) ? "Complete" : "Incomplete";
    default:
      return "";
  }
}

export default function AdminSeekersPage() {
  const { users, deleteSeeker } = useAuth();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState<TypeFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const seekers = users.filter((u) => u.role === "seeker");

  const filtered = useMemo(() => {
    const rows = seekers.filter((s) => {
      const kind = seekerRegistryType(s.seekerProfile);
      if (typeFilter !== "all" && kind !== typeFilter) return false;
      const hay = `${s.email} ${s.seekerProfile?.fullName || ""} ${s.seekerProfile?.city || ""} ${s.seekerProfile?.cnic || ""}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    const sorted = [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
    return sorted;
  }, [seekers, search, typeFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, typeFilter, pageSize, sortKey, sortDir]);

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
      <PageHeader
        title="Job Seekers"
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Job Seekers List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={typeFilter}
              onChange={(v) => setTypeFilter(v as TypeFilter)}
              searchPlaceholder="Search types..."
              options={[
                { value: "all", label: "All types" },
                { value: "Internal", label: "Internal" },
                { value: "External", label: "External" },
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search seekers..."
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
                  label="Email"
                  active={sortKey === "email"}
                  dir={sortDir}
                  onClick={() => toggleSort("email")}
                />
                <SortHeader
                  label="City"
                  active={sortKey === "city"}
                  dir={sortDir}
                  onClick={() => toggleSort("city")}
                />
                <SortHeader
                  label="Type"
                  active={sortKey === "type"}
                  dir={sortDir}
                  onClick={() => toggleSort("type")}
                />
                <SortHeader
                  label="Profile"
                  active={sortKey === "profile"}
                  dir={sortDir}
                  onClick={() => toggleSort("profile")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={6} />
              ) : (
                paged.map((s, index) => {
                const kind = seekerRegistryType(s.seekerProfile);
                const complete = isSeekerProfileComplete(s.seekerProfile);
                return (
                  <tr
                    key={s.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">
                      {s.seekerProfile?.fullName || "—"}
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{s.email}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{s.seekerProfile?.city || "—"}</td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={kind}
                        tone={kind === "Internal" ? "info" : "neutral"}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={complete ? "Complete" : "Incomplete"}
                        tone={complete ? "success" : "warning"}
                      />
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          { label: "View", href: `/admin/seekers/${s.id}` },
                          { label: "View CV", href: `/admin/seekers/${s.id}?tab=cv` },
                          {
                            label: "Delete",
                            tone: "danger",
                            onClick: () => {
                              if (
                                confirm(
                                  `Delete job seeker "${s.seekerProfile?.fullName || s.email}"? Their applications will also be removed.`
                                )
                              ) {
                                alert(deleteSeeker(s.id).message);
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
