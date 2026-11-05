"use client";

import { useEffect, useMemo, useState } from "react";
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
type SortKey = "applicant" | "job" | "cnic" | "phone" | "status" | "applied";

export default function EmployerApplicantsPage() {
  const { user, jobs, applications, users, updateApplicationStatus } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [jobFilter, setJobFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("applied");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const myJobs = useMemo(
    () => jobs.filter((j) => j.employerId === user?.id),
    [jobs, user?.id]
  );
  const myJobIds = useMemo(() => new Set(myJobs.map((j) => j.id)), [myJobs]);
  const apps = useMemo(
    () => applications.filter((a) => myJobIds.has(a.jobId)),
    [applications, myJobIds]
  );

  const jobOptions = useMemo(() => {
    const used = new Set(apps.map((a) => a.jobId));
    return myJobs
      .filter((j) => used.has(j.id))
      .map((j) => ({ value: j.id, label: j.title }))
      .sort((a, b) => a.label.localeCompare(b.label));
  }, [myJobs, apps]);

  const filtered = useMemo(() => {
    function sortValue(app: (typeof apps)[number], key: SortKey) {
      const job = jobs.find((j) => j.id === app.jobId);
      const seeker = users.find((u) => u.id === app.seekerId);
      const name =
        seeker?.seekerProfile?.fullName || seeker?.email || "Applicant";
      switch (key) {
        case "applicant":
          return name.toLowerCase();
        case "job":
          return (job?.title || "").toLowerCase();
        case "cnic":
          return (seeker?.seekerProfile?.cnic || "").toLowerCase();
        case "phone":
          return (seeker?.seekerProfile?.phone || "").toLowerCase();
        case "status":
          return app.status.toLowerCase();
        case "applied":
          return app.appliedAt || "";
        default:
          return "";
      }
    }

    const rows = apps.filter((app) => {
      if (statusFilter !== "all" && app.status !== statusFilter) return false;
      if (jobFilter !== "all" && app.jobId !== jobFilter) return false;
      const job = jobs.find((j) => j.id === app.jobId);
      const seeker = users.find((u) => u.id === app.seekerId);
      const hay =
        `${job?.title || ""} ${seeker?.email || ""} ${seeker?.seekerProfile?.fullName || ""} ${seeker?.seekerProfile?.cnic || ""} ${app.status}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [apps, jobs, users, search, statusFilter, jobFilter, sortKey, sortDir]);

  useEffect(() => {
    setPage(1);
  }, [search, statusFilter, jobFilter, pageSize, sortKey, sortDir]);

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
      <PageHeader title="Applicants" />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Applicants List</h2>
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
            <SearchableFilter
              value={jobFilter}
              onChange={setJobFilter}
              searchPlaceholder="Search jobs..."
              options={[
                { value: "all", label: "All jobs" },
                ...jobOptions,
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search applicants..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Applicant"
                  active={sortKey === "applicant"}
                  dir={sortDir}
                  onClick={() => toggleSort("applicant")}
                />
                <SortHeader
                  label="Job"
                  active={sortKey === "job"}
                  dir={sortDir}
                  onClick={() => toggleSort("job")}
                />
                <SortHeader
                  label="CNIC"
                  active={sortKey === "cnic"}
                  dir={sortDir}
                  onClick={() => toggleSort("cnic")}
                />
                <SortHeader
                  label="Phone"
                  active={sortKey === "phone"}
                  dir={sortDir}
                  onClick={() => toggleSort("phone")}
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
                <TableEmptyRow colSpan={7} />
              ) : (
                paged.map((app, index) => {
                const job = jobs.find((j) => j.id === app.jobId);
                const seeker = users.find((u) => u.id === app.seekerId);
                const name =
                  seeker?.seekerProfile?.fullName || seeker?.email || "Applicant";
                return (
                  <tr
                    key={app.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5">
                      <div className="font-medium text-[#1b2a4a]">{name}</div>
                      <div className="text-xs text-[#6b7c99]">{seeker?.email || "—"}</div>
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{job?.title || "—"}</td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {seeker?.seekerProfile?.cnic || "—"}
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {seeker?.seekerProfile?.phone || "—"}
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge label={app.status} tone={appStatusTone(app.status)} />
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {new Date(app.appliedAt).toLocaleDateString()}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          {
                            label: "Shortlist",
                            onClick: () => updateApplicationStatus(app.id, "Shortlisted"),
                          },
                          {
                            label: "Under Review",
                            onClick: () => updateApplicationStatus(app.id, "Under Review"),
                          },
                          {
                            label: "Selected",
                            onClick: () => updateApplicationStatus(app.id, "Selected"),
                          },
                          {
                            label: "Reject",
                            tone: "danger",
                            onClick: () => updateApplicationStatus(app.id, "Rejected"),
                          },
                          ...APPLICATION_STATUSES.filter(
                            (s) =>
                              ![
                                "Shortlisted",
                                "Under Review",
                                "Selected",
                                "Rejected",
                              ].includes(s)
                          ).map((s) => ({
                            label: `Mark ${s}`,
                            onClick: () => updateApplicationStatus(app.id, s),
                          })),
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
