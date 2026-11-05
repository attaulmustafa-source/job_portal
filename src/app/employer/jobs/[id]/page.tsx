"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { useAuth } from "@/lib/auth-store";
import { JOB_TYPES } from "@/lib/jobs";

export default function EditJobPage() {
  const params = useParams<{ id: string }>();
  const { user, jobs, updateJob } = useAuth();
  const router = useRouter();
  const job = jobs.find((j) => j.id === params.id && j.employerId === user?.id);

  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [experienceRequired, setExperienceRequired] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!job) return;
    setTitle(job.title);
    setLocation(job.location);
    setType(job.type);
    setDescription(job.description);
    setExpiryDate(job.expiryDate);
    setExperienceRequired(Boolean(job.experienceRequired));
    setExperienceDetails(job.experienceDetails || "");
  }, [job]);

  if (!job) {
    return (
      <div>
        <PageHeader title="Job not found" />
        <Link href="/employer/jobs" className="text-sm text-primary">
          Back
        </Link>
      </div>
    );
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (experienceRequired && !experienceDetails.trim()) {
      setMessage("Enter the experience requirement when experience is required.");
      return;
    }
    const result = updateJob(job!.id, {
      title,
      location,
      type,
      description,
      expiryDate,
      experienceRequired,
      experienceDetails: experienceRequired ? experienceDetails.trim() : "",
    });
    setMessage(result.message);
    if (result.ok) router.push("/employer/jobs");
  }

  return (
    <div>
      <PageHeader title="Edit Job" subtitle="Update details and expiry date." />
      <Card>
        <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
          {message ? (
            <div className="sm:col-span-2">
              <Alert tone="info">{message}</Alert>
            </div>
          ) : null}
          <div className="sm:col-span-2 rounded-lg border border-[#e5ebf5] bg-[#f8fafc] px-3 py-2 text-sm text-[#5b6b85]">
            Job category: <strong className="text-[#1b2a4a]">{job.category}</strong>
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
              {!JOB_TYPES.includes(type as (typeof JOB_TYPES)[number]) && type ? (
                <option value={type}>{type}</option>
              ) : null}
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
                className="min-h-28 w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
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
          <div className="sm:col-span-2 flex gap-2">
            <Button type="submit">Save Changes</Button>
            <Link href="/employer/jobs">
              <Button type="button" variant="secondary">
                Cancel
              </Button>
            </Link>
          </div>
        </form>
      </Card>
    </div>
  );
}
