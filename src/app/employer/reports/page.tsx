"use client";

import { ReportsHub } from "@/components/reports/ReportsHub";
import { EMPLOYER_REPORT_TYPES } from "@/lib/reports";

export default function EmployerReportsPage() {
  return (
    <ReportsHub
      title="Recruitment Reports"
      subtitle="Choose a report for your jobs and applicants."
      basePath="/employer/reports"
      reports={EMPLOYER_REPORT_TYPES}
    />
  );
}
