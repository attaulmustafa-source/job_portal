"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { TableEmptyRow } from "@/components/ui/TableEmptyRow";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { ActionsMenu } from "@/components/ui/ActionsMenu";
import { SearchableFilter, TableSearchInput } from "@/components/ui/SearchableFilter";
import { SortHeader, type SortDir } from "@/components/ui/SortHeader";
import { TablePagination } from "@/components/ui/TablePagination";
import { useAuth } from "@/lib/auth-store";
import type { AppNotification } from "@/lib/types";

type StatusFilter = "all" | "Unread" | "Read";
type SortKey = "title" | "message" | "status" | "date";

function statusLabel(n: AppNotification) {
  return n.read ? "Read" : "Unread";
}

function sortValue(n: AppNotification, key: SortKey) {
  switch (key) {
    case "title":
      return n.title.toLowerCase();
    case "message":
      return n.message.toLowerCase();
    case "status":
      return statusLabel(n);
    case "date":
      return n.createdAt || "";
    default:
      return "";
  }
}

export function NotificationsPanel({ title = "Notifications" }: { title?: string }) {
  const router = useRouter();
  const { user, notifications, markNotificationRead, markAllNotificationsRead } = useAuth();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [sortKey, setSortKey] = useState<SortKey>("date");
  const [sortDir, setSortDir] = useState<SortDir>("desc");

  const mine = useMemo(
    () => notifications.filter((n) => n.userId === user?.id),
    [notifications, user?.id]
  );

  const unreadCount = mine.filter((n) => !n.read).length;

  const filtered = useMemo(() => {
    const rows = mine.filter((n) => {
      const status = statusLabel(n);
      if (statusFilter === "Unread" && status !== "Unread") return false;
      if (statusFilter === "Read" && status !== "Read") return false;
      const hay = `${n.title} ${n.message}`.toLowerCase();
      return !search || hay.includes(search.toLowerCase());
    });

    return [...rows].sort((a, b) => {
      const av = sortValue(a, sortKey);
      const bv = sortValue(b, sortKey);
      if (av < bv) return sortDir === "asc" ? -1 : 1;
      if (av > bv) return sortDir === "asc" ? 1 : -1;
      return 0;
    });
  }, [mine, search, statusFilter, sortKey, sortDir]);

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
    setSortDir(key === "date" ? "desc" : "asc");
  }

  return (
    <div>
      <PageHeader
        title={title}
        actions={
          <Button
            variant="secondary"
            onClick={markAllNotificationsRead}
            disabled={unreadCount === 0}
          >
            Mark all as read
          </Button>
        }
      />

      <div className="rounded-lg border border-[#e5ebf5] bg-white shadow-sm">
        <div className="flex flex-col gap-2 border-b border-[#e5ebf5] px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-semibold text-[#1b2a4a]">Notifications List</h2>
          <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center">
            <SearchableFilter
              value={statusFilter}
              onChange={(v) => setStatusFilter(v as StatusFilter)}
              searchPlaceholder="Search statuses..."
              options={[
                { value: "all", label: "All statuses" },
                { value: "Unread", label: "Unread" },
                { value: "Read", label: "Read" },
              ]}
            />
            <TableSearchInput
              value={search}
              onChange={setSearch}
              placeholder="Search notifications..."
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
                  label="Message"
                  active={sortKey === "message"}
                  dir={sortDir}
                  onClick={() => toggleSort("message")}
                />
                <SortHeader
                  label="Status"
                  active={sortKey === "status"}
                  dir={sortDir}
                  onClick={() => toggleSort("status")}
                />
                <SortHeader
                  label="Date"
                  active={sortKey === "date"}
                  dir={sortDir}
                  onClick={() => toggleSort("date")}
                />
                <th className="border border-[#e8eef6] bg-[#f8fafc] p-0 text-left text-[11px] font-semibold uppercase tracking-wide text-black"><span className="block px-2 py-1.5">Action</span></th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <TableEmptyRow colSpan={5} />
              ) : (
                paged.map((n, index) => {
                const status = statusLabel(n);
                return (
                  <tr
                    key={n.id}
                    className={`border-b border-[#eef2f7] last:border-0 hover:bg-[#fafbfd] ${
                      index % 2 === 1 ? "bg-[#fafbfd]" : "bg-white"
                    } ${!n.read ? "bg-[#f5f8ff]" : ""}`}
                  >
                    <td className="px-2 py-1.5 font-medium text-[#1b2a4a]">{n.title}</td>
                    <td className="max-w-md px-2 py-1.5 text-[#5b6b85]">
                      <span className="line-clamp-2">{n.message}</span>
                    </td>
                    <td className="px-2 py-1.5">
                      <StatusBadge
                        label={status}
                        tone={n.read ? "neutral" : "info"}
                      />
                    </td>
                    <td className="whitespace-nowrap px-2 py-1.5 text-[#5b6b85]">
                      {new Date(n.createdAt).toLocaleString()}
                    </td>
                    <td className="relative z-10 px-2 py-1.5 text-left transition-colors hover:!bg-[#e9ecef]">
                      <ActionsMenu
                        items={[
                          {
                            label: n.href ? "Open" : "View",
                            onClick: () => {
                              if (!n.read) markNotificationRead(n.id);
                              if (n.href) router.push(n.href);
                            },
                          },
                          ...(!n.read
                            ? [
                                {
                                  label: "Mark read",
                                  onClick: () => markNotificationRead(n.id),
                                },
                              ]
                            : []),
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
