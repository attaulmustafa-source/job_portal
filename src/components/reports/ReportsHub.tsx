"use client";

import Link from "next/link";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  REPORT_TONE_STYLES,
  type ReportCatalogItem,
} from "@/lib/reports";

function ReportIcon({ tone }: { tone: ReportCatalogItem["tone"] }) {
  const styles = REPORT_TONE_STYLES[tone];
  return (
    <span
      className={`inline-flex h-11 w-11 items-center justify-center rounded-xl ${styles.iconBg} ${styles.iconText}`}
      aria-hidden
    >
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
        <path
          d="M7 3h7l4 4v14a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1z"
          stroke="currentColor"
          strokeWidth="1.6"
        />
        <path d="M14 3v4h4M8 12h8M8 16h5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    </span>
  );
}

export function ReportsHub({
  title,
  subtitle,
  basePath,
  reports,
}: {
  title: string;
  subtitle: string;
  basePath: string;
  reports: ReportCatalogItem[];
}) {
  return (
    <div>
      <PageHeader title={title} subtitle={subtitle} />
      <div className="grid gap-4 sm:grid-cols-2">
        {reports.map((report) => {
          const styles = REPORT_TONE_STYLES[report.tone];
          return (
            <Link
              key={report.id}
              href={`${basePath}/${report.id}`}
              className="group block rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#2f4d9a]/40 hover:shadow-md hover:bg-[#f8fafc]"
            >
              <ReportIcon tone={report.tone} />
              <h2 className="mt-4 text-lg font-semibold text-[#1b2a4a] group-hover:text-[#2f4d9a]">
                {report.label}
              </h2>
              <p className="mt-1 text-sm leading-relaxed text-[#6b7c99]">{report.description}</p>
              <span
                className={`mt-5 inline-flex items-center gap-1 text-sm font-medium ${styles.link}`}
              >
                Open report
                <span
                  aria-hidden
                  className="inline-block transition-transform duration-200 group-hover:translate-x-1"
                >
                  →
                </span>
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
