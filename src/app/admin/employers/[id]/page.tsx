"use client";

import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { PageHeader } from "@/components/layout/PageHeader";
import { OrgLogo } from "@/components/jobs/OrgLogo";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";
import { isJobActive } from "@/lib/jobs";
import type { EmployerApprovalStatus } from "@/lib/types";

function approvalTone(status?: EmployerApprovalStatus) {
  if (status === "approved") return "success" as const;
  if (status === "pending") return "warning" as const;
  if (status === "rejected") return "danger" as const;
  return "neutral" as const;
}

function approvalLabel(status?: EmployerApprovalStatus) {
  if (status === "approved") return "Approved";
  if (status === "pending") return "Pending";
  if (status === "rejected") return "Rejected";
  return "Incomplete";
}

function Field({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted">{label}</dt>
      <dd className="max-w-[60%] text-right font-medium">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

function BlockField({ label, value }: { label: string; value?: string }) {
  return (
    <div>
      <dt className="text-muted">{label}</dt>
      <dd className="mt-1 whitespace-pre-wrap font-medium">{value?.trim() ? value : "—"}</dd>
    </div>
  );
}

export default function AdminEmployerDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { users, jobs, applications, deleteEmployer, setEmployerApproval } = useAuth();
  const employer = users.find((u) => u.id === params.id && u.role === "employer");

  if (!employer) {
    return (
      <div>
        <PageHeader title="Employer not found" />
        <Link href="/admin/employers" className="text-sm text-primary">
          Back to employers
        </Link>
      </div>
    );
  }

  const org = employer.organization;
  const empJobs = jobs.filter((j) => j.employerId === employer.id);
  const jobIds = new Set(empJobs.map((j) => j.id));
  const apps = applications.filter((a) => jobIds.has(a.jobId));

  return (
    <div>
      <PageHeader
        title={org?.organizationName || employer.email}
        subtitle="Employer profile and organization details"
      />

      <div className="mb-4 flex flex-wrap gap-2">
        <Link href="/admin/employers">
          <Button variant="secondary">Back</Button>
        </Link>
        {employer.employerApproval === "approved" ? (
          <Link href={`/admin/employers/${employer.id}/jobs/new`}>
            <Button>Post Job</Button>
          </Link>
        ) : null}
        {employer.employerApproval === "pending" ? (
          <>
            <Button onClick={() => setEmployerApproval(employer.id, "approved")}>Approve</Button>
            <Button variant="danger" onClick={() => setEmployerApproval(employer.id, "rejected")}>
              Reject
            </Button>
          </>
        ) : null}
        <Button
          variant="danger"
          onClick={() => {
            if (confirm("Delete this employer and their jobs?")) {
              const result = deleteEmployer(employer.id);
              alert(result.message);
              if (result.ok) router.push("/admin/employers");
            }
          }}
        >
          Delete Employer
        </Button>
      </div>

      <div className="mb-4 flex items-center gap-3">
        <OrgLogo
          name={org?.organizationName || employer.email}
          logoUrl={org?.logoUrl}
          size="lg"
        />
        <StatusBadge
          label={approvalLabel(employer.employerApproval)}
          tone={approvalTone(employer.employerApproval)}
        />
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <Card title="Contact Profile">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="Email" value={employer.email} />
            <Field label="Username" value={employer.username} />
            <Field label="Contact name" value={employer.employerProfile?.contactName} />
            <Field label="Phone" value={employer.employerProfile?.phone} />
            <Field label="Designation" value={employer.employerProfile?.designation} />
            <Field label="Approval" value={approvalLabel(employer.employerApproval)} />
          </dl>
        </Card>

        <Card title="Basic Information">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="Organization name" value={org?.organizationName} />
            <Field label="Organization type" value={org?.category} />
            <Field label="Organization size" value={org?.organizationSize} />
            <Field label="Registration authority" value={org?.registrationAuthority} />
            <Field label="Registration number" value={org?.registrationNumber} />
            <Field label="NTN" value={org?.ntn} />
            <Field label="Administration level" value={org?.administrationLevel} />
            <Field label="Industry" value={org?.industry} />
          </dl>
        </Card>

        <Card title="Administrative Status">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="Ministry" value={org?.ministry} />
            <Field label="Division" value={org?.division} />
            <Field label="Admin province" value={org?.adminProvince} />
          </dl>
        </Card>

        <Card title="Employer Address">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="Country" value={org?.country} />
            <Field label="Province / State" value={org?.provinceState} />
            <Field label="District" value={org?.district} />
            <Field label="Tehsil" value={org?.tehsil} />
            <BlockField label="Address" value={org?.address} />
            <BlockField label="About organization" value={org?.about} />
          </dl>
        </Card>

        <Card title="Leadership & Focal Person">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="CEO name" value={org?.ceoName} />
            <Field label="CEO number" value={org?.ceoNumber} />
            <Field
              label="Focal person name"
              value={org?.focalPersonName || employer.employerProfile?.contactName}
            />
            <Field
              label="Focal person phone"
              value={org?.focalPersonPhone || employer.employerProfile?.phone}
            />
            <Field
              label="Focal person designation"
              value={org?.focalPersonDesignation || employer.employerProfile?.designation}
            />
          </dl>
        </Card>

        <Card title="Website & Vision">
          <dl className="space-y-2 text-sm text-foreground">
            <Field label="Website" value={org?.website} />
            <Field label="Fax number" value={org?.faxNumber} />
            <BlockField label="Vision" value={org?.vision} />
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Organization logo</dt>
              <dd className="font-medium">{org?.logoUrl ? "Uploaded" : "—"}</dd>
            </div>
          </dl>
        </Card>
      </div>

      <div className="mt-4 grid gap-4 sm:grid-cols-3">
        <Card title="Jobs">
          <p className="text-3xl font-semibold">{empJobs.length}</p>
        </Card>
        <Card title="Active Jobs">
          <p className="text-3xl font-semibold">{empJobs.filter(isJobActive).length}</p>
        </Card>
        <Card title="Applications">
          <p className="text-3xl font-semibold">{apps.length}</p>
        </Card>
      </div>
    </div>
  );
}
