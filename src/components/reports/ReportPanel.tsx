"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  buildReport,
  exportReportCsv,
  exportReportPdf,
  type ReportContext,
  type ReportType,
} from "@/lib/reports";

export function ReportPanel({
  title,
  subtitle,
  reportTypes,
  context,
}: {
  title: string;
  subtitle: string;
  reportTypes: { id: ReportType; label: string }[];
  context: Omit<ReportContext, "dateFrom" | "dateTo" | "search">;
}) {
  const [type, setType] = useState<ReportType>(reportTypes[0]?.id || "seekers");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  const [search, setSearch] = useState("");

  const result = useMemo(
    () =>
      buildReport(type, {
        ...context,
        dateFrom: dateFrom || undefined,
        dateTo: dateTo || undefined,
        search: search || undefined,
      }),
    [type, context, dateFrom, dateTo, search]
  );

  const maxSummary = Math.max(...result.summary.map((s) => s.value), 1);

  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />

      <Card title="Filters">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="block space-y-1.5 text-sm text-foreground">
            <span className="font-medium">Report Type</span>
            <select
              className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
              value={type}
              onChange={(e) => setType(e.target.value as ReportType)}
            >
              {reportTypes.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.label}
                </option>
              ))}
            </select>
          </label>
          <Input
            label="From Date"
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
          />
          <Input
            label="To Date"
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
          />
          <Input
            label="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter rows..."
          />
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          <Button
            onClick={() =>
              exportReportCsv(result, `${result.title}-${new Date().toISOString().slice(0, 10)}`)
            }
          >
            Export Excel (CSV)
          </Button>
          <Button variant="secondary" onClick={() => exportReportPdf(result)}>
            Export PDF
          </Button>
        </div>
      </Card>

      <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {result.summary.map((s) => (
          <Card key={s.label} title={s.label}>
            <p className="text-3xl font-semibold text-foreground">{s.value}</p>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-primary-soft">
              <div
                className="h-full rounded-full bg-primary"
                style={{ width: `${Math.round((s.value / maxSummary) * 100)}%` }}
              />
            </div>
          </Card>
        ))}
      </div>

      <div className="mt-4">
        <Card title={result.title}>
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse text-left text-sm text-foreground">
              <thead>
                <tr className="border-b border-border bg-primary-soft">
                  {result.columns.map((c) => (
                    <th key={c.key} className="px-3 py-2 font-semibold">
                      {c.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.rows.length === 0 ? (
                  <tr>
                    <td
                      className="px-3 py-4 text-muted"
                      colSpan={result.columns.length || 1}
                    >
                      No rows for the selected filters.
                    </td>
                  </tr>
                ) : (
                  result.rows.map((row, idx) => (
                    <tr key={idx} className="border-b border-border">
                      {result.columns.map((c) => (
                        <td key={c.key} className="px-3 py-2">
                          {String(row[c.key] ?? "")}
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <p className="mt-3 text-xs text-muted">
            Showing {result.rows.length} row(s). PDF opens print dialog — choose “Save as PDF”.
          </p>
        </Card>
      </div>
    </div>
  );
}
