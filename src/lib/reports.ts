import type {
  CounsellingBooking,
  CounsellingSession,
  JobApplication,
  JobPosting,
  PlacementCenter,
  ResumeTemplate,
  SeekerResume,
  UserAccount,
} from "./types";
import { isJobActive } from "./jobs";
import { isSeekerProfileComplete } from "./profile";

export type ReportType =
  | "seekers"
  | "employers"
  | "jobs"
  | "applications"
  | "placement"
  | "counselling"
  | "resumes"
  | "registrations";

export interface ReportColumn {
  key: string;
  label: string;
}

export interface ReportResult {
  title: string;
  columns: ReportColumn[];
  rows: Record<string, string | number>[];
  summary: { label: string; value: number }[];
}

export interface ReportContext {
  users: UserAccount[];
  jobs: JobPosting[];
  applications: JobApplication[];
  centers: PlacementCenter[];
  bookings: CounsellingBooking[];
  sessions: CounsellingSession[];
  resumes: SeekerResume[];
  resumeTemplates: ResumeTemplate[];
  /** Limit data for employer/officer roles */
  employerId?: string;
  officerCenterId?: string;
  officerId?: string;
  dateFrom?: string;
  dateTo?: string;
  search?: string;
}

function inDateRange(iso: string | undefined, from?: string, to?: string) {
  if (!iso) return true;
  const day = iso.slice(0, 10);
  if (from && day < from) return false;
  if (to && day > to) return false;
  return true;
}

function matchesSearch(row: Record<string, string | number>, search?: string) {
  if (!search?.trim()) return true;
  const q = search.toLowerCase();
  return Object.values(row).some((v) => String(v).toLowerCase().includes(q));
}

export type ReportTone = "blue" | "slate" | "green" | "red" | "purple" | "amber" | "teal" | "indigo";

export type ReportCatalogItem = {
  id: ReportType;
  label: string;
  description: string;
  tone: ReportTone;
};

export const REPORT_TONE_STYLES: Record<
  ReportTone,
  { iconBg: string; iconText: string; link: string }
> = {
  blue: { iconBg: "bg-[#e8eefc]", iconText: "text-[#2f4d9a]", link: "text-[#2f4d9a]" },
  slate: { iconBg: "bg-[#eef2f7]", iconText: "text-[#475569]", link: "text-[#475569]" },
  green: { iconBg: "bg-[#e8f8ef]", iconText: "text-[#15803d]", link: "text-[#15803d]" },
  red: { iconBg: "bg-[#fde8e8]", iconText: "text-[#b91c1c]", link: "text-[#b91c1c]" },
  purple: { iconBg: "bg-[#f3e8ff]", iconText: "text-[#7e22ce]", link: "text-[#7e22ce]" },
  amber: { iconBg: "bg-[#fff7e6]", iconText: "text-[#b45309]", link: "text-[#b45309]" },
  teal: { iconBg: "bg-[#e6f7f5]", iconText: "text-[#0f766e]", link: "text-[#0f766e]" },
  indigo: { iconBg: "bg-[#eef0ff]", iconText: "text-[#4338ca]", link: "text-[#4338ca]" },
};

export const ADMIN_REPORT_TYPES: ReportCatalogItem[] = [
  {
    id: "seekers",
    label: "Job Seekers",
    description: "Seeker registrations, profile completion, and contact details.",
    tone: "blue",
  },
  {
    id: "employers",
    label: "Employers",
    description: "Employer organizations by type, approval status, and activity.",
    tone: "amber",
  },
  {
    id: "jobs",
    label: "Job Postings",
    description: "Published jobs by category, type, location, and expiry.",
    tone: "indigo",
  },
  {
    id: "applications",
    label: "Job Applications",
    description: "Application volume and status pipeline across jobs.",
    tone: "red",
  },
  {
    id: "placement",
    label: "Placement Centers",
    description: "Centers, officers, and placement capacity overview.",
    tone: "slate",
  },
  {
    id: "counselling",
    label: "Counselling",
    description: "Booking requests, sessions, and counselling outcomes.",
    tone: "green",
  },
  {
    id: "resumes",
    label: "Resumes",
    description: "Saved resumes and template usage across seekers.",
    tone: "purple",
  },
  {
    id: "registrations",
    label: "Registrations",
    description: "New user registrations by role over time.",
    tone: "teal",
  },
];

export const EMPLOYER_REPORT_TYPES: ReportCatalogItem[] = [
  {
    id: "jobs",
    label: "My Job Postings",
    description: "Your posted jobs, status, and expiry tracking.",
    tone: "indigo",
  },
  {
    id: "applications",
    label: "My Applicants",
    description: "Applicants and status progress for your jobs only.",
    tone: "red",
  },
];

export const OFFICER_REPORT_TYPES: ReportCatalogItem[] = [
  {
    id: "counselling",
    label: "Centre Bookings & Sessions",
    description: "Bookings and sessions for your assigned center.",
    tone: "green",
  },
  {
    id: "placement",
    label: "My Centre Summary",
    description: "Center activity summary for your placement centre.",
    tone: "slate",
  },
];

export function getReportMeta(id: string, catalog: ReportCatalogItem[]) {
  return catalog.find((r) => r.id === id);
}

export function buildReport(type: ReportType, ctx: ReportContext): ReportResult {
  switch (type) {
    case "seekers":
      return seekersReport(ctx);
    case "employers":
      return employersReport(ctx);
    case "jobs":
      return jobsReport(ctx);
    case "applications":
      return applicationsReport(ctx);
    case "placement":
      return placementReport(ctx);
    case "counselling":
      return counsellingReport(ctx);
    case "resumes":
      return resumesReport(ctx);
    case "registrations":
      return registrationsReport(ctx);
    default:
      return { title: "Report", columns: [], rows: [], summary: [] };
  }
}

function seekersReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "name", label: "Name" },
    { key: "email", label: "Email" },
    { key: "cnic", label: "CNIC" },
    { key: "phone", label: "Phone" },
    { key: "city", label: "City" },
    { key: "profile", label: "Profile" },
    { key: "createdAt", label: "Registered" },
  ];
  let rows = ctx.users
    .filter((u) => u.role === "seeker")
    .filter((u) => inDateRange(u.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((u) => ({
      name: u.seekerProfile?.fullName || "—",
      email: u.email,
      cnic: u.seekerProfile?.cnic || "—",
      phone: u.seekerProfile?.phone || "—",
      city: u.seekerProfile?.city || "—",
      profile: isSeekerProfileComplete(u.seekerProfile) ? "Complete" : "Incomplete",
      createdAt: u.createdAt.slice(0, 10),
    }))
    .filter((r) => matchesSearch(r, ctx.search));

  const complete = rows.filter((r) => r.profile === "Complete").length;
  return {
    title: "Job Seekers Report",
    columns,
    rows,
    summary: [
      { label: "Total Seekers", value: rows.length },
      { label: "Profile Complete", value: complete },
      { label: "Incomplete", value: rows.length - complete },
    ],
  };
}

function employersReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "organization", label: "Organization" },
    { key: "email", label: "Email" },
    { key: "category", label: "Category" },
    { key: "status", label: "Approval Status" },
    { key: "contact", label: "Contact" },
    { key: "createdAt", label: "Registered" },
  ];
  const rows = ctx.users
    .filter((u) => u.role === "employer")
    .filter((u) => inDateRange(u.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((u) => ({
      organization: u.organization?.organizationName || "—",
      email: u.email,
      category: u.organization?.category || "—",
      status: u.employerApproval || "incomplete",
      contact: u.employerProfile?.contactName || "—",
      createdAt: u.createdAt.slice(0, 10),
    }))
    .filter((r) => matchesSearch(r, ctx.search));

  return {
    title: "Employers Report",
    columns,
    rows,
    summary: [
      { label: "Total Employers", value: rows.length },
      { label: "Approved", value: rows.filter((r) => r.status === "approved").length },
      { label: "Pending", value: rows.filter((r) => r.status === "pending").length },
      { label: "Rejected", value: rows.filter((r) => r.status === "rejected").length },
    ],
  };
}

function jobsReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "title", label: "Title" },
    { key: "company", label: "Company" },
    { key: "location", label: "Location" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status" },
    { key: "expiryDate", label: "Expiry" },
    { key: "createdAt", label: "Posted" },
  ];
  let jobs = ctx.jobs;
  if (ctx.employerId) jobs = jobs.filter((j) => j.employerId === ctx.employerId);

  const rows = jobs
    .filter((j) => inDateRange(j.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((j) => ({
      title: j.title,
      company: j.company,
      location: j.location,
      type: j.type,
      status: isJobActive(j) ? "Active" : j.status,
      expiryDate: j.expiryDate,
      createdAt: j.createdAt.slice(0, 10),
    }))
    .filter((r) => matchesSearch(r, ctx.search));

  return {
    title: ctx.employerId ? "My Job Postings Report" : "Job Postings Report",
    columns,
    rows,
    summary: [
      { label: "Total Jobs", value: rows.length },
      { label: "Active", value: rows.filter((r) => r.status === "Active").length },
      { label: "Expired", value: rows.filter((r) => r.status === "expired").length },
    ],
  };
}

function applicationsReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "job", label: "Job" },
    { key: "company", label: "Company" },
    { key: "seeker", label: "Seeker" },
    { key: "status", label: "Status" },
    { key: "appliedAt", label: "Applied" },
  ];
  let apps = ctx.applications;
  if (ctx.employerId) {
    const jobIds = new Set(ctx.jobs.filter((j) => j.employerId === ctx.employerId).map((j) => j.id));
    apps = apps.filter((a) => jobIds.has(a.jobId));
  }

  const rows = apps
    .filter((a) => inDateRange(a.appliedAt, ctx.dateFrom, ctx.dateTo))
    .map((a) => {
      const job = ctx.jobs.find((j) => j.id === a.jobId);
      const seeker = ctx.users.find((u) => u.id === a.seekerId);
      return {
        job: job?.title || "—",
        company: job?.company || "—",
        seeker: seeker?.seekerProfile?.fullName || seeker?.email || "—",
        status: a.status,
        appliedAt: a.appliedAt.slice(0, 10),
      };
    })
    .filter((r) => matchesSearch(r, ctx.search));

  const byStatus = (s: string) => rows.filter((r) => r.status === s).length;
  return {
    title: ctx.employerId ? "My Applicants Report" : "Job Applications Report",
    columns,
    rows,
    summary: [
      { label: "Total Applications", value: rows.length },
      { label: "Shortlisted", value: byStatus("Shortlisted") },
      { label: "Selected", value: byStatus("Selected") },
      { label: "Rejected", value: byStatus("Rejected") },
    ],
  };
}

function placementReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "center", label: "Center" },
    { key: "city", label: "City" },
    { key: "active", label: "Active" },
    { key: "officers", label: "Officers" },
    { key: "bookings", label: "Bookings" },
    { key: "sessions", label: "Sessions" },
  ];

  let centers = ctx.centers;
  if (ctx.officerCenterId) {
    centers = centers.filter((c) => c.id === ctx.officerCenterId);
  }

  const rows = centers
    .map((c) => {
      const officers = ctx.users.filter(
        (u) => u.role === "officer" && u.placementCenterId === c.id
      ).length;
      const bookings = ctx.bookings.filter((b) => b.centerId === c.id).length;
      const sessions = ctx.sessions.filter((s) => s.centerId === c.id).length;
      return {
        center: c.name,
        city: c.city,
        active: c.active ? "Yes" : "No",
        officers,
        bookings,
        sessions,
      };
    })
    .filter((r) => matchesSearch(r, ctx.search));

  return {
    title: ctx.officerCenterId ? "My Centre Summary" : "Placement Centers Report",
    columns,
    rows,
    summary: [
      { label: "Centers", value: rows.length },
      { label: "Total Officers", value: rows.reduce((n, r) => n + Number(r.officers), 0) },
      { label: "Total Bookings", value: rows.reduce((n, r) => n + Number(r.bookings), 0) },
    ],
  };
}

function counsellingReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "type", label: "Type" },
    { key: "topic", label: "Topic / Mode" },
    { key: "seeker", label: "Seeker" },
    { key: "center", label: "Center" },
    { key: "status", label: "Status" },
    { key: "date", label: "Date" },
  ];

  let bookings = ctx.bookings;
  let sessions = ctx.sessions;
  if (ctx.officerCenterId) {
    bookings = bookings.filter((b) => b.centerId === ctx.officerCenterId);
    sessions = sessions.filter((s) => s.centerId === ctx.officerCenterId);
  }

  const bookingRows = bookings
    .filter((b) => inDateRange(b.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((b) => {
      const seeker = ctx.users.find((u) => u.id === b.seekerId);
      const center = ctx.centers.find((c) => c.id === b.centerId);
      return {
        type: "Booking",
        topic: b.topic,
        seeker: seeker?.seekerProfile?.fullName || seeker?.email || "—",
        center: center?.name || "—",
        status: b.status,
        date: b.preferredDate || b.createdAt.slice(0, 10),
      };
    });

  const sessionRows = sessions
    .filter((s) => inDateRange(s.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((s) => {
      const seeker = ctx.users.find((u) => u.id === s.seekerId);
      const center = ctx.centers.find((c) => c.id === s.centerId);
      return {
        type: "Session",
        topic: s.mode,
        seeker: seeker?.seekerProfile?.fullName || seeker?.email || "—",
        center: center?.name || "—",
        status: s.status,
        date: s.scheduledDate,
      };
    });

  const rows = [...bookingRows, ...sessionRows].filter((r) => matchesSearch(r, ctx.search));

  return {
    title: "Counselling Report",
    columns,
    rows,
    summary: [
      { label: "Bookings", value: bookingRows.length },
      { label: "Sessions", value: sessionRows.length },
      {
        label: "Completed Sessions",
        value: sessionRows.filter((r) => r.status === "Completed").length,
      },
      {
        label: "Pending Bookings",
        value: bookingRows.filter((r) => r.status === "Pending").length,
      },
    ],
  };
}

function resumesReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "title", label: "Resume Title" },
    { key: "seeker", label: "Seeker" },
    { key: "template", label: "Template" },
    { key: "updatedAt", label: "Updated" },
  ];
  const rows = ctx.resumes
    .filter((r) => inDateRange(r.updatedAt, ctx.dateFrom, ctx.dateTo))
    .map((r) => {
      const seeker = ctx.users.find((u) => u.id === r.seekerId);
      const tpl = ctx.resumeTemplates.find((t) => t.id === r.templateId);
      return {
        title: r.title,
        seeker: seeker?.seekerProfile?.fullName || seeker?.email || "—",
        template: tpl?.name || "—",
        updatedAt: r.updatedAt.slice(0, 10),
      };
    })
    .filter((r) => matchesSearch(r, ctx.search));

  return {
    title: "Resumes Report",
    columns,
    rows,
    summary: [
      { label: "Saved Resumes", value: rows.length },
      { label: "Active Templates", value: ctx.resumeTemplates.filter((t) => t.active).length },
      { label: "Total Templates", value: ctx.resumeTemplates.length },
    ],
  };
}

function registrationsReport(ctx: ReportContext): ReportResult {
  const columns = [
    { key: "email", label: "Email" },
    { key: "role", label: "Role" },
    { key: "name", label: "Name" },
    { key: "createdAt", label: "Registered" },
  ];
  const rows = ctx.users
    .filter((u) => inDateRange(u.createdAt, ctx.dateFrom, ctx.dateTo))
    .map((u) => ({
      email: u.email,
      role: u.role,
      name:
        u.seekerProfile?.fullName ||
        u.fullName ||
        u.organization?.organizationName ||
        u.employerProfile?.contactName ||
        "—",
      createdAt: u.createdAt.slice(0, 10),
    }))
    .filter((r) => matchesSearch(r, ctx.search));

  return {
    title: "User Registrations Report",
    columns,
    rows,
    summary: [
      { label: "Total Users", value: rows.length },
      { label: "Seekers", value: rows.filter((r) => r.role === "seeker").length },
      { label: "Employers", value: rows.filter((r) => r.role === "employer").length },
      { label: "Officers", value: rows.filter((r) => r.role === "officer").length },
    ],
  };
}

export function exportReportCsv(result: ReportResult, fileName: string) {
  const header = result.columns.map((c) => c.label).join(",");
  const lines = result.rows.map((row) =>
    result.columns
      .map((c) => {
        const val = String(row[c.key] ?? "");
        return `"${val.replace(/"/g, '""')}"`;
      })
      .join(",")
  );
  const csv = [header, ...lines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `${fileName.replace(/[^\w\-]+/g, "_")}.csv`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function exportReportPdf(result: ReportResult) {
  const summaryHtml = result.summary
    .map((s) => `<li><strong>${s.label}:</strong> ${s.value}</li>`)
    .join("");
  const head = result.columns.map((c) => `<th>${c.label}</th>`).join("");
  const body = result.rows
    .map(
      (row) =>
        `<tr>${result.columns.map((c) => `<td>${String(row[c.key] ?? "")}</td>`).join("")}</tr>`
    )
    .join("");

  const html = `<!doctype html><html><head><meta charset="utf-8"/><title>${result.title}</title>
    <style>
      body{font-family:Arial,Helvetica,sans-serif;color:#111;margin:24px}
      h1{font-size:20px;margin:0 0 12px}
      table{width:100%;border-collapse:collapse;font-size:12px;margin-top:16px}
      th,td{border:1px solid #ddd;padding:6px 8px;text-align:left}
      th{background:#eff6ff}
      ul{padding-left:18px}
    </style></head><body>
      <h1>${result.title}</h1>
      <p>Generated: ${new Date().toLocaleString()}</p>
      <ul>${summaryHtml}</ul>
      <table><thead><tr>${head}</tr></thead><tbody>${body || "<tr><td colspan='99'>No rows</td></tr>"}</tbody></table>
    </body></html>`;

  const win = window.open("", "_blank", "noopener,noreferrer,width=1000,height=800");
  if (!win) {
    alert("Please allow pop-ups to export PDF (Print → Save as PDF).");
    return;
  }
  win.document.open();
  win.document.write(html);
  win.document.close();
  win.focus();
  setTimeout(() => win.print(), 300);
}
