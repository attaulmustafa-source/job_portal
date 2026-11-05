"use client";

import { ReportsHub } from "@/components/reports/ReportsHub";
import { OFFICER_REPORT_TYPES } from "@/lib/reports";

export default function OfficerReportsPage() {
  return (
    <ReportsHub
      title="Placement Reports"
      subtitle="Choose a report for your assigned placement centre."
      basePath="/officer/reports"
      reports={OFFICER_REPORT_TYPES}
    />
  );
}
