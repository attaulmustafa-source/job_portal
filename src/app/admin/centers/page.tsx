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
import type { PlacementCenter } from "@/lib/types";

type StatusFilter = "all" | "Active" | "In-Active";
type SortKey = "name" | "city" | "phone" | "officers" | "status";

function statusLabel(center: PlacementCenter) {
  return center.active ? "Active" : "In-Active";
}

export default function AdminCentersPage() {
  const { centers, users, updateCenter, deleteCenter } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const officerCountByCenter = useMemo(() => {
    const map = new Map<string, number>();
    users
      .filter((u) => u.role === "officer" && u.placementCenterId)
      .forEach((u) => {
        const id = u.placementCenterId as string;
        map.set(id, (map.get(id) || 0) + 1);
      });
    return map;
  }, [users]);

  function sortValue(center: PlacementCenter, key: SortKey) {
    switch (key) {
      case "name":
        return center.name.toLowerCase();
      case "city":
        return center.city.toLowerCase();
      case "phone":
        return center.phone.toLowerCase();
      case "officers":
        return String(officerCountByCenter.get(center.id) || 0).padStart(4, "0");
      case "status":
        return statusLabel(center);
      default:
        return "";
    }
  }

  const filtered = useMemo(() => {
    const rows = centers.filter((center) => {
      const status = statusLabel(center);
      if (statusFilter === "Active" && status !== "Active") return false;
      if (statusFilter === "In-Active" && status !== "In-Active") return false;
      const hay = `${center.name} ${center.city} ${center.address} ${center.phone}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });
    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [centers, search, statusFilter, sortKey, sortDir, officerCountByCenter]);

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
    setSortDir("asc");
  }

  return (
    <div>
      <PageHeader
        title="Placement Centers"
        actions={
          <Link href="/admin/centers/new">
            <Button>+ Create Center</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Centers List</h2>
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
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search centers..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Center"
                  active={sortKey === "name"}
                  dir={sortDir}
                  onClick={() => toggleSort("name")}
                />
                <SortHeader
                  label="City"
                  active={sortKey === "city"}
                  dir={sortDir}
                  onClick={() => toggleSort("city")}
                />
                <SortHeader
                  label="Phone"
                  active={sortKey === "phone"}
                  dir={sortDir}
                  onClick={() => toggleSort("phone")}
                />
                <SortHeader
                  label="Officers"
                  active={sortKey === "officers"}
                  dir={sortDir}
                  onClick={() => toggleSort("officers")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={6} />
              ) : (
                paged.map((center, index) => {
                const officerCount = officerCountByCenter.get(center.id) || 0;
                const active = center.active;
                return (
                  <tr
                    key={center.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5">
                      <p className="font-medium text-[#1b2a4a]">{center.name}</p>
                      <p className="text-xs text-[#6b7c99]">{center.address}</p>
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{center.city}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{center.phone}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{officerCount}</td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={active ? "Active" : "In-Active"}
                        tone={active ? "success" : "neutral"}
                      />
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          {
                            label: active ? "In-Active" : "Activate",
                            tone: active ? "warning" : "default",
                            onClick: () => updateCenter(center.id, { active: !center.active }),
                          },
                          {
                            label: "Delete",
                            tone: "danger",
                            onClick: () => {
                              if (confirm(`Delete center "${center.name}"?`)) {
                                alert(deleteCenter(center.id).message);
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
