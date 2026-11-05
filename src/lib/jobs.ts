import type { EmployerCategory, JobPosting } from "./types";

export const EMPLOYER_CATEGORIES: EmployerCategory[] = [
  "Government",
  "Private",
  "Foreign",
];

export const JOB_TYPES = [
  "Full-time",
  "Part-time",
  "Internship",
  "Contract",
] as const;

export function isEmployerCategory(value: string): value is EmployerCategory {
  return EMPLOYER_CATEGORIES.includes(value as EmployerCategory);
}

export function categoryTone(category?: string) {
  if (category === "Government") return "info" as const;
  if (category === "Private") return "success" as const;
  if (category === "Foreign") return "warning" as const;
  return "neutral" as const;
}

function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function isJobExpired(job: Pick<JobPosting, "expiryDate" | "status">) {
  if (job.status === "expired") return true;
  if (!job.expiryDate) return false;
  const expiry = new Date(job.expiryDate);
  expiry.setHours(0, 0, 0, 0);
  return expiry < startOfToday();
}

export function isJobActive(job: JobPosting) {
  return job.status === "published" && !isJobExpired(job);
}

/** Sync expired flag based on expiryDate */
export function withComputedJobStatus(job: JobPosting): JobPosting {
  if (job.status === "draft") return job;
  if (isJobExpired({ ...job, status: "published" })) {
    return { ...job, status: "expired" };
  }
  if (job.status === "expired" && job.expiryDate) {
    const expiry = new Date(job.expiryDate);
    expiry.setHours(0, 0, 0, 0);
    if (expiry >= startOfToday()) {
      return { ...job, status: "published" };
    }
  }
  return job;
}

export function normalizeJobs(jobs: JobPosting[]) {
  return jobs.map((job) =>
    withComputedJobStatus({
      ...job,
      category: isEmployerCategory(job.category || "") ? job.category : "Private",
    })
  );
}

export function withJobCategoryFromEmployer(
  job: JobPosting,
  employerCategory?: string
): JobPosting {
  if (isEmployerCategory(job.category || "")) return job;
  return {
    ...job,
    category: isEmployerCategory(employerCategory || "")
      ? (employerCategory as EmployerCategory)
      : "Private",
  };
}

export function daysUntilExpiry(expiryDate: string) {
  const expiry = new Date(expiryDate);
  expiry.setHours(0, 0, 0, 0);
  const today = startOfToday();
  const diff = Math.ceil((expiry.getTime() - today.getTime()) / (1000 * 60 * 60 * 24));
  return diff;
}

export const APPLICATION_STATUSES = [
  "Applied",
  "Under Review",
  "Shortlisted",
  "Interview Scheduled",
  "Selected",
  "Rejected",
] as const;
