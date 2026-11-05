"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge } from "@/components/jobs/CategoryBadge";
import { OrgLogo } from "@/components/jobs/OrgLogo";
import { StatusBadge, appStatusTone, jobStatusTone } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";
import { daysUntilExpiry, isJobActive } from "@/lib/jobs";

export default function AdminJobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { jobs, users, applications, deleteJob } = useAuth();
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div>
        <PageHeader title="Job not found" />
        <Link href="/admin/jobs" className="text-sm text-primary">
          Back to jobs
        </Link>
      </div>
    );
  }

  const active = isJobActive(job);
  const employer = users.find((u) => u.id === job.employerId);
  const apps = applications.filter((a) => a.jobId === job.id);

  return (
    <div>
      <PageHeader title={job.title} subtitle={`${job.company} · ${job.location}`} />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/jobs">
          <Button variant="secondary">Back</Button>
        </Link>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Delete this job and related applications?")) {
              const result = deleteJob(job.id);
              alert(result.message);
              if (result.ok) router.push("/admin/jobs");
            }
          }}
        >
          Delete Job
        </Button>
      </div>

      <Card>
        <div className="flex items-start gap-3">
          <OrgLogo name={job.company} logoUrl={job.companyLogo} size="lg" />
          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge
              label={active ? "Active" : job.status}
              tone={jobStatusTone(active ? "published" : job.status)}
            />
            <CategoryBadge category={job.category} />
            <StatusBadge label={job.type} tone="info" />
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground whitespace-pre-wrap">{job.description}</p>
        <dl className="mt-4 grid gap-3 text-sm text-foreground sm:grid-cols-2">
          <div>
            <dt className="text-muted">Company</dt>
            <dd className="font-medium">{job.company}</dd>
          </div>
          <div>
            <dt className="text-muted">Employer</dt>
            <dd className="font-medium">
              {employer ? (
                <Link href={`/admin/employers/${employer.id}`} className="text-primary">
                  {employer.organization?.organizationName || employer.email}
                </Link>
              ) : (
                "—"
              )}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd className="font-medium">{job.location}</dd>
          </div>
          <div>
            <dt className="text-muted">Expiry date</dt>
            <dd className="font-medium">
              {job.expiryDate}
              {active ? ` · ${daysUntilExpiry(job.expiryDate)} day(s) left` : ""}
            </dd>
          </div>
        </dl>
      </Card>

      <div className="mt-4">
        <Card title={`Applicants (${apps.length})`}>
          {apps.length === 0 ? (
            <p className="text-sm text-muted">No applications for this job.</p>
          ) : (
            <ul className="space-y-2">
              {apps.map((app) => {
                const seeker = users.find((u) => u.id === app.seekerId);
                return (
                  <li
                    key={app.id}
                    className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-0"
                  >
                    <div>
                      <Link
                        href={`/admin/seekers/${app.seekerId}?tab=cv`}
                        className="font-medium text-primary"
                      >
                        {seeker?.seekerProfile?.fullName || seeker?.email || "Seeker"}
                      </Link>
                      <p className="text-xs text-muted">
                        Applied {new Date(app.appliedAt).toLocaleString()}
                      </p>
                    </div>
                    <StatusBadge label={app.status} tone={appStatusTone(app.status)} />
                  </li>
                );
              })}
            </ul>
          )}
        </Card>
      </div>
    </div>
  );
}
