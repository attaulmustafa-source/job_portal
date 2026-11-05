"use client";

import Link from "next/link";
import { useCallback, useState } from "react";
import { useParams } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { CategoryBadge } from "@/components/jobs/CategoryBadge";
import { OrgLogo } from "@/components/jobs/OrgLogo";
import { StatusBadge, jobStatusTone } from "@/components/jobs/StatusBadge";
import { TimedAlert } from "@/components/ui/TimedAlert";
import { useAuth } from "@/lib/auth-store";
import { daysUntilExpiry, isJobActive } from "@/lib/jobs";
import { canApplyToJob } from "@/lib/profile";

export default function SeekerJobDetailPage() {
  const params = useParams<{ id: string }>();
  const { user, jobs, applications, applyToJob } = useAuth();
  const [toast, setToast] = useState<string | null>(null);
  const hideToast = useCallback(() => setToast(null), []);
  const job = jobs.find((j) => j.id === params.id);

  if (!job) {
    return (
      <div>
        <PageHeader title="Job not found" />
        <Link href="/seeker/jobs" className="text-sm text-primary">
          Back to jobs
        </Link>
      </div>
    );
  }

  const eligibility = canApplyToJob(user?.seekerProfile, job);
  const active = isJobActive(job);
  const already = applications.some((a) => a.jobId === job.id && a.seekerId === user?.id);
  const days = daysUntilExpiry(job.expiryDate);

function onApply() {
  const currentJob = job;

  if (!currentJob || already) return;

  if (!active) {
    setToast("This job has expired or is closed.");
    return;
  }

  if (!eligibility.ok) {
    setToast(eligibility.message || "Please complete your profile before applying.");
    return;
  }

  const result = applyToJob(currentJob.id);
  setToast(result.message);
}
  return (
    <div>
      <PageHeader title={job.title} subtitle={`${job.company} · ${job.location}`} />

      <TimedAlert
        message={toast}
        tone={toast?.toLowerCase().includes("submitted") ? "success" : "warning"}
        onHide={hideToast}
      />

      {!active ? (
        <div className="mb-4">
          <Alert tone="danger">This job has expired or is closed. Applications are disabled.</Alert>
        </div>
      ) : null}

      <Card
        actions={
          <Button disabled={already || !active} onClick={onApply}>
            {already ? "Already Applied" : active ? "Apply Now" : "Expired"}
          </Button>
        }
      >
        <div className="flex items-start gap-3">
          <OrgLogo name={job.company} logoUrl={job.companyLogo} size="lg" />
          <div className="flex flex-wrap gap-2 pt-1">
            <StatusBadge
              label={active ? "Active" : job.status}
              tone={jobStatusTone(active ? "published" : job.status)}
            />
            <CategoryBadge category={job.category} />
            <StatusBadge label={job.type} tone="info" />
            {job.experienceRequired ? (
              <StatusBadge
                label={
                  job.experienceDetails
                    ? `Experience: ${job.experienceDetails}`
                    : "Experience required"
                }
                tone="warning"
              />
            ) : null}
          </div>
        </div>
        <p className="mt-4 text-sm text-foreground whitespace-pre-wrap">{job.description}</p>
        <dl className="mt-4 grid gap-2 text-sm text-foreground sm:grid-cols-2">
          <div>
            <dt className="text-muted">Company</dt>
            <dd className="font-medium">{job.company}</dd>
          </div>
          <div>
            <dt className="text-muted">Location</dt>
            <dd className="font-medium">{job.location}</dd>
          </div>
          <div>
            <dt className="text-muted">Expiry</dt>
            <dd className="font-medium">
              {job.expiryDate}
              {active ? ` · ${days} day(s) left` : ""}
            </dd>
          </div>
          <div>
            <dt className="text-muted">Category</dt>
            <dd className="font-medium">{job.category}</dd>
          </div>
        </dl>
        {!eligibility.ok ? (
          <p className="mt-4 text-sm text-[#6b7c99]">
            {eligibility.message}{" "}
            <Link href="/seeker/profile" className="font-medium text-primary hover:underline">
              Complete profile
            </Link>
          </p>
        ) : null}
      </Card>
    </div>
  );
}
