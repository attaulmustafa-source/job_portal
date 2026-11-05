"use client";

import Link from "next/link";
import { Suspense, useMemo } from "react";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { SeekerCv } from "@/components/seeker/SeekerCv";
import { StatusBadge, appStatusTone } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";
import { educationSummary, isSeekerProfileComplete, skillsSummary } from "@/lib/profile";

function SeekerDetailContent() {
  const params = useParams<{ id: string }>();
  const search = useSearchParams();
  const router = useRouter();
  const tab = search.get("tab") === "cv" ? "cv" : "profile";
  const { users, jobs, applications, deleteSeeker } = useAuth();
  const seeker = users.find((u) => u.id === params.id && u.role === "seeker");

  const apps = useMemo(
    () => applications.filter((a) => a.seekerId === seeker?.id),
    [applications, seeker?.id]
  );

  if (!seeker) {
    return (
      <div>
        <PageHeader title="Job seeker not found" />
        <Link href="/admin/seekers" className="text-sm text-primary">
          Back to job seekers
        </Link>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        title={seeker.seekerProfile?.fullName || seeker.email}
        subtitle="Job seeker profile and CV"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/seekers">
          <Button variant="secondary">Back</Button>
        </Link>
        <Link href={`/admin/seekers/${seeker.id}`}>
          <Button variant={tab === "profile" ? "primary" : "secondary"}>Profile</Button>
        </Link>
        <Link href={`/admin/seekers/${seeker.id}?tab=cv`}>
          <Button variant={tab === "cv" ? "primary" : "secondary"}>View CV</Button>
        </Link>
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Delete this job seeker and their applications?")) {
              const result = deleteSeeker(seeker.id);
              alert(result.message);
              if (result.ok) router.push("/admin/seekers");
            }
          }}
        >
          Delete Seeker
        </Button>
      </div>

      {tab === "cv" ? (
        <SeekerCv seeker={seeker} />
      ) : (
        <>
          <div className="grid gap-4 lg:grid-cols-2">
            <Card title="Profile">
              <dl className="space-y-2 text-sm text-foreground">
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Email</dt>
                  <dd className="font-medium">{seeker.email}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Full name</dt>
                  <dd className="font-medium">{seeker.seekerProfile?.fullName || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">CNIC</dt>
                  <dd className="font-medium">{seeker.seekerProfile?.cnic || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Phone</dt>
                  <dd className="font-medium">{seeker.seekerProfile?.phone || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">City</dt>
                  <dd className="font-medium">{seeker.seekerProfile?.city || "—"}</dd>
                </div>
                <div className="flex justify-between gap-3">
                  <dt className="text-muted">Profile status</dt>
                  <dd className="font-medium">
                    {isSeekerProfileComplete(seeker.seekerProfile) ? "Complete" : "Incomplete"}
                  </dd>
                </div>
              </dl>
            </Card>

            <Card title="Education & Skills">
              <p className="text-sm text-foreground">
                <span className="text-muted">Education:</span>{" "}
                {educationSummary(seeker.seekerProfile)}
              </p>
              <p className="mt-3 text-sm text-foreground whitespace-pre-wrap">
                <span className="text-muted">Skills:</span>{" "}
                {skillsSummary(seeker.seekerProfile)}
              </p>
            </Card>
          </div>

          <div className="mt-4">
            <Card title="Applications">
              {apps.length === 0 ? (
                <p className="text-sm text-muted">No applications yet.</p>
              ) : (
                <ul className="space-y-2">
                  {apps.map((app) => {
                    const job = jobs.find((j) => j.id === app.jobId);
                    return (
                      <li
                        key={app.id}
                        className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-2 text-sm last:border-0"
                      >
                        <span className="text-foreground">{job?.title || "Job"}</span>
                        <StatusBadge label={app.status} tone={appStatusTone(app.status)} />
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>
          </div>
        </>
      )}
    </div>
  );
}

export default function AdminSeekerDetailPage() {
  return (
    <Suspense fallback={<div className="text-sm text-muted">Loading...</div>}>
      <SeekerDetailContent />
    </Suspense>
  );
}
