"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense } from "react";
import type { UserRole } from "@/lib/types";
import { dashboardPath } from "@/lib/nav";

const SEGMENT_LABELS: Record<string, string> = {
  dashboard: "Dashboard",
  employers: "Employers",
  active: "Active",
  pending: "Pending",
  government: "Government",
  private: "Private",
  foreign: "Foreign",
  seekers: "Job Seekers",
  jobs: "Jobs",
  applications: "Applications",
  applicants: "Applicants",
  resumes: "Resumes",
  counselling: "Counselling",
  notifications: "Notifications",
  settings: "Settings",
  profile: "Profile",
  qualification: "Qualification",
  experience: "Experience",
  skills: "Skills",
  certifications: "Certifications",
  languages: "Languages",
  projects: "Projects",
  references: "References",
  organization: "Organization",
  reports: "Reports",
  centers: "Placement Centers",
  officers: "Placement Officers",
  templates: "Resume Templates",
  bookings: "Bookings",
  sessions: "Sessions",
  "change-password": "Change Password",
};

function labelFor(segment: string, index: number, parts: string[]) {
  const parent = parts[index - 1];
  if (segment === "new") {
    if (parent === "centers") return "Create Center";
    if (parent === "officers") return "Create Officer";
    if (parent === "templates") return "Create Template";
    if (parent === "resumes") return "Create Resume";
    if (parent === "counselling") return "Request Counselling";
    if (parent === "jobs") return "Post Job";
    return "Create";
  }
  // report detail under /reports/[type]
  if (parent === "reports") {
    const reportLabels: Record<string, string> = {
      seekers: "Job Seekers Report",
      employers: "Employers Report",
      jobs: "Job Postings Report",
      applications: "Applications Report",
      placement: "Placement Report",
      counselling: "Counselling Report",
      resumes: "Resumes Report",
      registrations: "Registrations Report",
    };
    if (reportLabels[segment]) return reportLabels[segment];
  }
  if (SEGMENT_LABELS[segment]) return SEGMENT_LABELS[segment];
  // dynamic ids: show Detail / based on parent
  if (parent === "jobs") return "Job Detail";
  if (parent === "employers") return "Employer Detail";
  if (parent === "seekers") return "Seeker Detail";
  if (parent === "resumes") return "Resume Editor";
  // /admin/employers/[id]/jobs/new — middle "jobs" under employer id
  if (segment === "jobs" && parts[index - 2] === "employers") return "Jobs";
  return "Detail";
}

function BreadcrumbsInner({ role }: { role: UserRole }) {
  const pathname = usePathname() || `/${role}/dashboard`;
  const home = dashboardPath(role);
  const parts = pathname.split("/").filter(Boolean);

  // /admin/dashboard → hide lone Dashboard crumb (TopBar already shows context)
  if (parts.length <= 2 && parts[1] === "dashboard") {
    return null;
  }

  // Build crumbs after role: e.g. admin/employers/id
  const crumbs = parts.slice(1).map((segment, i, arr) => {
    const href = `/${parts[0]}/${arr.slice(0, i + 1).join("/")}`;
    const label = labelFor(segment, i, arr);
    const isLast = i === arr.length - 1;
    return { href, label, isLast };
  });

  return (
    <nav aria-label="Breadcrumb" className="mb-2 flex flex-wrap items-center gap-1 text-xs">
      <Link href={home} className="font-medium text-[#2f4d9a] hover:underline">
        Dashboard
      </Link>
      {crumbs.map((crumb) => (
        <span key={crumb.href} className="inline-flex items-center gap-1.5">
          <span className="text-[#9aa6bc]" aria-hidden>
            →
          </span>
          {crumb.isLast ? (
            <span className="font-medium text-[#5b6b85]">{crumb.label}</span>
          ) : (
            <Link href={crumb.href} className="font-medium text-[#2f4d9a] hover:underline">
              {crumb.label}
            </Link>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Breadcrumbs({ role }: { role: UserRole }) {
  return (
    <Suspense
      fallback={null}
    >
      <BreadcrumbsInner role={role} />
    </Suspense>
  );
}
