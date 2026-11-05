"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { ReportDetail } from "@/components/reports/ReportDetail";
import { useAuth } from "@/lib/auth-store";
import { ADMIN_REPORT_TYPES, getReportMeta } from "@/lib/reports";

export default function AdminReportDetailPage() {
  const params = useParams<{ type: string }>();
  const report = getReportMeta(params.type, ADMIN_REPORT_TYPES);
  const {
    users,
    jobs,
    applications,
    centers,
    bookings,
    sessions,
    resumes,
    resumeTemplates,
  } = useAuth();

  if (!report) {
    return (
      <div>
        <PageHeader title="Report not found" />
        <Link href="/admin/reports">
          <Button variant="secondary">← Back to reports</Button>
        </Link>
      </div>
    );
  }

  return (
    <ReportDetail
      report={report}
      backHref="/admin/reports"
      context={{
        users,
        jobs,
        applications,
        centers,
        bookings,
        sessions,
        resumes,
        resumeTemplates,
      }}
    />
  );
}
