"use client";

import { ReportsHub } from "@/components/reports/ReportsHub";
import { ADMIN_REPORT_TYPES } from "@/lib/reports";

export default function AdminReportsPage() {
  return (
    <ReportsHub
      title="Reports"
      subtitle="Choose a report to open filters, tables, and exports."
      basePath="/admin/reports"
      reports={ADMIN_REPORT_TYPES}
    />
  );
}
