"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import type { UserAccount } from "@/lib/types";

type CenterFilter = "all" | "unassigned" | string;
type SortKey = "name" | "email" | "phone" | "center";

export default function AdminOfficersPage() {
  const { users, centers, updateOfficerAssignment, deleteOfficer } = useAuth();
  const officers = users.filter((u) => u.role === "officer");

  const [search, setSearch] = useState("");
  const [centerFilter, setCenterFilter] = useState<CenterFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");
  const [assignMessage, setAssignMessage] = useState("");

  function centerName(officer: UserAccount) {
    return centers.find((c) => c.id === officer.placementCenterId)?.name || "Unassigned";
  }

  function sortValue(officer: UserAccount, key: SortKey) {
    switch (key) {
      case "name":
        return (officer.fullName || officer.email).toLowerCase();
      case "email":
        return officer.email.toLowerCase();
      case "phone":
        return (officer.phone || "").toLowerCase();
      case "center":
        return centerName(officer).toLowerCase();
      default:
        return "";
    }
  }

  const filtered = useMemo(() => {
    const rows = officers.filter((officer) => {
      if (centerFilter === "unassigned" && officer.placementCenterId) return false;
      if (
        centerFilter !== "all" &&
        centerFilter !== "unassigned" &&
        officer.placementCenterId !== centerFilter
      ) {
        return false;
      }
      const hay = `${officer.fullName || ""} ${officer.email} ${officer.phone || ""} ${centerName(officer)}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });
    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [officers, centers, search, centerFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, centerFilter, pageSize, sortKey, sortDir]);

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
        title="Placement Officers"
        actions={
          <Link href="/admin/officers/new">
            <Button>+ Create Officer</Button>
          </Link>
        }
      />

      {assignMessage ? (
        <div className="mb-4">
          <Alert tone="info">{assignMessage}</Alert>
        </div>
      ) : null}

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Officers List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={centerFilter}
              onChange={setCenterFilter}
              searchPlaceholder="Search centers..."
              options={[
                { value: "all", label: "All centers" },
                { value: "unassigned", label: "Unassigned" },
                ...centers.map((c) => ({ value: c.id, label: c.name })),
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search officers..."
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
                  label="Phone"
                  active={sortKey === "phone"}
                  dir={sortDir}
                  onClick={() => toggleSort("phone")}
                />
                <SortHeader
                  label="Center"
                  active={sortKey === "center"}
                  dir={sortDir}
                  onClick={() => toggleSort("center")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={5} />
              ) : (
                paged.map((officer, index) => (
                <tr
                  key={officer.id}
                  className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                    index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                  }`}
                >
                  <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">
                    {officer.fullName || "—"}
                  </td>
                  <td className="px-2 py-1.5 text-[#5b6b85]">{officer.email}</td>
                  <td className="px-2 py-1.5 text-[#5b6b85]">{officer.phone || "—"}</td>
                  <td className="px-2 py-1.5">
                    <select
                      className="max-w-[14rem] rounded-md border border-[#dbe3ef] bg-white px-2 py-1.5 text-sm outline-none focus:border-primary"
                      value={officer.placementCenterId || ""}
                      onChange={(e) => {
                        const result = updateOfficerAssignment(officer.id, e.target.value);
                        setAssignMessage(result.message);
                      }}
                    >
                      <option value="">Unassigned</option>
                      {centers.map((c) => (
                        <option key={c.id} value={c.id}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                    <ActionsMenu
                      items={[
                        {
                          label: "Delete",
                          tone: "danger",
                          onClick: () => {
                            if (
                              confirm(`Delete officer "${officer.fullName || officer.email}"?`)
                            ) {
                              alert(deleteOfficer(officer.id).message);
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
