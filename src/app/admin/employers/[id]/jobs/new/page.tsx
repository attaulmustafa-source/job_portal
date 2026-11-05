"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-store";
import { JOB_TYPES } from "@/lib/jobs";

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export default function AdminPostJobForEmployerPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { users, createJobForEmployer } = useAuth();
  const employer = users.find((u) => u.id === params.id && u.role === "employer");

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState(defaultExpiry());
  const [experienceRequired, setExperienceRequired] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState("");
  const [error, setError] = useState("");

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

  const canPost = employer.employerApproval === "approved";
  const orgName = employer.organization?.organizationName || employer.email;
  const orgCategory = employer.organization?.category;

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (orgCategory !== "Government" && orgCategory !== "Private" && orgCategory !== "Foreign") {
      setError("Employer organization category must be Government, Private, or Foreign.");
      return;
    }
    if (experienceRequired && !experienceDetails.trim()) {
      setError("Enter the experience requirement when experience is required.");
      return;
    }
    const result = createJobForEmployer(employer!.id, {
      title,
      company: orgName,
      companyLogo: employer!.organization?.logoUrl || "",
      category: orgCategory,
      location,
      type,
      description,
      expiryDate,
      experienceRequired,
      experienceDetails: experienceRequired ? experienceDetails.trim() : "",
    });
    if (!result.ok) {
      setError(result.message);
      return;
    }
    router.push(`/admin/employers/${employer!.id}`);
  }

  return (
    <div>
      <PageHeader
        title="Post Job for Employer"
        subtitle={`Publishing as ${orgName}. Category comes from the employer organization.`}
      />
      <div className="mb-4">
        <Link href={`/admin/employers/${employer.id}`}>
          <Button variant="secondary">Back to employer</Button>
        </Link>
      </div>
      {!canPost ? (
        <Alert tone="danger">
          This employer is not active. Approve them first before posting a job on their behalf.
        </Alert>
      ) : (
        <Card>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            {error ? (
              <div className="sm:col-span-2">
                <Alert tone="danger">{error}</Alert>
              </div>
            ) : null}
            <div className="sm:col-span-2 rounded-lg border border-[#e5ebf5] bg-[#f8fafc] px-3 py-2 text-sm text-[#5b6b85]">
              Employer: <strong className="text-[#1b2a4a]">{orgName}</strong>
              {" · "}
              Category:{" "}
              <strong className="text-[#1b2a4a]">{orgCategory || "Not set"}</strong>
            </div>
            <Input label="Job Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Job Type</span>
              <select
                className="w-full rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:border-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
                required
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Expiry Date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
            <div className="sm:col-span-2">
              <label className="block space-y-1.5 text-sm text-foreground">
                <span className="font-medium">Description</span>
                <textarea
                  className="min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 text-foreground outline-none focus:border-primary"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </label>
            </div>
            <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
              <input
                type="checkbox"
                checked={experienceRequired}
                onChange={(e) => {
                  setExperienceRequired(e.target.checked);
                  if (!e.target.checked) setExperienceDetails("");
                }}
              />
              Experience required to apply
            </label>
            {experienceRequired ? (
              <div className="sm:col-span-2">
                <Input
                  label="Experience requirement"
                  placeholder="e.g. 3+ years in related field"
                  value={experienceDetails}
                  onChange={(e) => setExperienceDetails(e.target.value)}
                  required
                />
              </div>
            ) : null}
            <div className="sm:col-span-2">
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </Card>
      )}
    </div>
  );
}
