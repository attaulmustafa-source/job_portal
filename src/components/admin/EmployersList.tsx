"use client";

import { useEffect, useMemo, useState } from "react";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge } from "@/components/jobs/CategoryBadge";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import { EMPLOYER_CATEGORIES } from "@/lib/jobs";
import type { EmployerApprovalStatus, EmployerCategory, UserAccount } from "@/lib/types";

function approvalTone(status?: EmployerApprovalStatus) {
  if (status === "approved") return "success" as const;
  if (status === "pending") return "warning" as const;
  if (status === "rejected") return "danger" as const;
  return "neutral" as const;
}

function approvalLabel(status?: EmployerApprovalStatus) {
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending";
  if (status === "rejected") return "Rejected";
  return "Incomplete";
}

function isEmployerActive(emp: UserAccount) {
  return emp.employerApproval === "approved";
}

function activityLabel(emp: UserAccount) {
  return isEmployerActive(emp) ? "Active" : "In-Active";
}

type CategoryFilter = "all" | EmployerCategory;
type ActivityFilter = "all" | "Active" | "In-Active";
type SortKey = "name" | "email" | "contact" | "type" | "status" | "activity";

function sortValue(emp: UserAccount, key: SortKey) {
  switch (key) {
    case "name":
      return (emp.organization?.organizationName || emp.email).toLowerCase();
    case "email":
      return emp.email.toLowerCase();
    case "contact":
      return (emp.employerProfile?.contactName || "").toLowerCase();
    case "type":
      return emp.organization?.category || "";
    case "status":
      return approvalLabel(emp.employerApproval);
    case "activity":
      return activityLabel(emp);
    default:
      return "";
  }
}

export type EmployersListProps = {
  title: string;
  subtitle?: string;
  /** Lock status filter (hides activity dropdown when set) */
  lockedStatus?: EmployerApprovalStatus;
  /** Lock category filter (hides type dropdown when set) */
  lockedCategory?: EmployerCategory;
};

export function EmployersList({
  title,
  subtitle,
  lockedStatus,
  lockedCategory,
}: EmployersListProps) {
  const { users, setEmployerApproval, deleteEmployer } = useAuth();
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<CategoryFilter>(lockedCategory || "all");
  const [activity, setActivity] = useState<ActivityFilter>(
    lockedStatus === "approved" ? "Active" : lockedStatus ? "In-Active" : "all"
  );
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("name");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const employers = users.filter((u) => u.role === "employer");
  const effectiveCategory = lockedCategory || category;

  const filtered = useMemo(() => {
    const rows = employers.filter((emp) => {
      if (lockedStatus && emp.employerApproval !== lockedStatus) return false;
      if (!lockedStatus) {
        const act = activityLabel(emp);
        if (activity === "Active" && act !== "Active") return false;
        if (activity === "In-Active" && act !== "In-Active") return false;
      }
      if (effectiveCategory !== "all" && emp.organization?.category !== effectiveCategory) {
        return false;
      }
      const hay =
        `${emp.email} ${emp.organization?.organizationName || ""} ${emp.employerProfile?.contactName || ""} ${emp.organization?.category || ""}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [employers, search, activity, effectiveCategory, lockedStatus, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, activity, category, pageSize, sortKey, sortDir, lockedStatus, lockedCategory]);

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
      <PageHeader title={title} subtitle={subtitle} />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Employers List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            {!lockedStatus ? (
              <SearchableFilter
                value={activity}
                onChange={(v) => setActivity(v as ActivityFilter)}
                searchPlaceholder="Search statuses..."
                options={[
                  { value: "all", label: "All statuses" },
                  { value: "Active", label: "Active" },
                  { value: "In-Active", label: "In-Active" },
                ]}
              />
            ) : null}
            {!lockedCategory ? (
              <SearchableFilter
                value={effectiveCategory}
                onChange={(v) => setCategory(v as CategoryFilter)}
                searchPlaceholder="Search types..."
                options={[
                  { value: "all", label: "All types" },
                  ...EMPLOYER_CATEGORIES.map((c) => ({ value: c, label: c })),
                ]}
              />
            ) : null}
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search employers..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Organization"
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
                  label="Contact"
                  active={sortKey === "contact"}
                  dir={sortDir}
                  onClick={() => toggleSort("contact")}
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
                  label="Activity"
                  active={sortKey === "activity"}
                  dir={sortDir}
                  onClick={() => toggleSort("activity")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={7} />
              ) : (
                paged.map((emp, index) => {
                const active = isEmployerActive(emp);
                return (
                  <tr
                    key={emp.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">
                      {emp.organization?.organizationName || "—"}
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{emp.email}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {emp.employerProfile?.contactName || "—"}
                    </td>
                    <td className="px-2 py-1.5">
                      <CategoryBadge category={emp.organization?.category} />
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={approvalLabel(emp.employerApproval)}
                        tone={approvalTone(emp.employerApproval)}
                      />
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={active ? "Active" : "In-Active"}
                        tone={active ? "success" : "neutral"}
                      />
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          { label: "View", href: `/admin/employers/${emp.id}` },
                          ...(active
                            ? [
                                {
                                  label: "Post Job",
                                  href: `/admin/employers/${emp.id}/jobs/new`,
                                } as const,
                                {
                                  label: "In-Active",
                                  tone: "warning" as const,
                                  onClick: () => setEmployerApproval(emp.id, "rejected"),
                                },
                              ]
                            : emp.employerApproval === "pending"
                              ? [
                                  {
                                    label: "Approve",
                                    onClick: () => setEmployerApproval(emp.id, "approved"),
                                  },
                                  {
                                    label: "Reject",
                                    tone: "danger" as const,
                                    onClick: () => setEmployerApproval(emp.id, "rejected"),
                                  },
                                ]
                              : [
                                  {
                                    label: "Activate",
                                    onClick: () => setEmployerApproval(emp.id, "approved"),
                                  },
                                ]),
                          {
                            label: "Delete",
                            tone: "danger",
                            onClick: () => {
                              if (
                                confirm(
                                  `Delete employer "${emp.organization?.organizationName || emp.email}"? Their jobs and applications will also be removed.`
                                )
                              ) {
                                alert(deleteEmployer(emp.id).message);
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
