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
import type { BookingStatus } from "@/lib/types";

type StatusFilter = "all" | BookingStatus;
type SortKey = "topic" | "center" | "preferred" | "status" | "session";

const BOOKING_STATUSES: BookingStatus[] = [
  "Pending",
  "Approved",
  "Rejected",
  "Scheduled",
  "Completed",
  "Cancelled",
];

function bookingTone(status: string) {
  if (status === "Completed" || status === "Approved" || status === "Scheduled") {
    return "success" as const;
  }
  if (status === "Pending") return "warning" as const;
  if (status === "Rejected" || status === "Cancelled") return "danger" as const;
  return "neutral" as const;
}

export default function SeekerCounsellingPage() {
  const { user, centers, bookings, sessions } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("preferred");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const mine = useMemo(
    () => bookings.filter((b) => b.seekerId === user?.id),
    [bookings, user?.id]
  );
  const mySessions = useMemo(
    () => sessions.filter((s) => s.seekerId === user?.id),
    [sessions, user?.id]
  );

  const filtered = useMemo(() => {
    function sortValue(booking: (typeof mine)[number], key: SortKey) {
      const center = centers.find((c) => c.id === booking.centerId);
      const session = mySessions.find((s) => s.bookingId === booking.id);
      switch (key) {
        case "topic":
          return booking.topic.toLowerCase();
        case "center":
          return (center?.name || "").toLowerCase();
        case "preferred":
          return `${booking.preferredDate} ${booking.preferredTime}`;
        case "status":
          return booking.status.toLowerCase();
        case "session":
          return session
            ? `${session.scheduledDate} ${session.scheduledTime}`
            : "";
        default:
          return "";
      }
    }

    const rows = mine.filter((b) => {
      if (statusFilter !== "all" && b.status !== statusFilter) return false;
      const center = centers.find((c) => c.id === b.centerId);
      const hay = `${b.topic} ${center?.name || ""} ${b.status} ${b.notes || ""}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [mine, centers, mySessions, search, statusFilter, sortKey, sortDir]);

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
    setSortDir(key === "preferred" || key === "session" ? "desc" : "asc");
  }

  return (
    <div>
      <PageHeader
        title="Counselling"
        actions={
          <Link href="/seeker/counselling/new">
            <Button>+ Request Counselling</Button>
          </Link>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Bookings List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              searchPlaceholder="Search statuses..."
              options={[
                { value: "all", label: "All statuses" },
                ...BOOKING_STATUSES.map((s) => ({ value: s, label: s })),
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search bookings..."
            />
          </div>
        </div>

        <table className="min-w-full border-collapse text-left text-xs">
            <thead>
              <tr className="border-b border-[#e5ebf5] text-xs font-semibold">
                <SortHeader
                  label="Topic"
                  active={sortKey === "topic"}
                  dir={sortDir}
                  onClick={() => toggleSort("topic")}
                />
                <SortHeader
                  label="Center"
                  active={sortKey === "center"}
                  dir={sortDir}
                  onClick={() => toggleSort("center")}
                />
                <SortHeader
                  label="Preferred"
                  active={sortKey === "preferred"}
                  dir={sortDir}
                  onClick={() => toggleSort("preferred")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortHeader
                  label="Session"
                  active={sortKey === "session"}
                  dir={sortDir}
                  onClick={() => toggleSort("session")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={6} />
              ) : (
                paged.map((b, index) => {
                const center = centers.find((c) => c.id === b.centerId);
                const session = mySessions.find((s) => s.bookingId === b.id);
                return (
                  <tr
                    key={b.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    }`}
                  >
                    <td className="px-2 py-1.5">
                      <div className="font-medium text-[#1b2a4a]">{b.topic}</div>
                      {b.notes ? (
                        <div className="mt-0.5 line-clamp-1 text-[10px] text-[#6b7c99]">
                          {b.notes}
                        </div>
                      ) : null}
                      {b.rejectionReason ? (
                        <div className="mt-0.5 text-[10px] text-[#dc2626]">
                          Reason: {b.rejectionReason}
                        </div>
                      ) : null}
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">{center?.name || "—"}</td>
                    <td className="whitespace-nowrap px-2 py-1.5 text-[#5b6b85]">
                      {b.preferredDate} {b.preferredTime}
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge label={b.status} tone={bookingTone(b.status)} />
                    </td>
                    <td className="px-2 py-1.5 text-[#5b6b85]">
                      {session ? (
                        <>
                          <div>
                            {session.scheduledDate} {session.scheduledTime}
                          </div>
                          <div className="text-[10px] text-[#6b7c99]">
                            {session.mode} · {session.status}
                          </div>
                        </>
                      ) : (
                        "—"
                      )}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          {
                            label: "Request again",
                            href: "/seeker/counselling/new",
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
