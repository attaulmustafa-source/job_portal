"use client";

import { FormEvent, useCallback, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { TimedAlert } from "@/components/ui/TimedAlert";
import { useAuth } from "@/lib/auth-store";
import { employerPostBlockMessage } from "@/lib/employer-gate";
import { JOB_TYPES } from "@/lib/jobs";
import { canEmployerPostJobs } from "@/lib/profile";

function defaultExpiry() {
  const d = new Date();
  d.setDate(d.getDate() + 30);
  return d.toISOString().slice(0, 10);
}

export default function NewJobPage() {
  const { user, createJob } = useAuth();
  const router = useRouter();
  const canPost = user ? canEmployerPostJobs(user) : false;
  const [toast, setToast] = useState<string | null>(null);
  const hideToast = useCallback(() => setToast(null), []);
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("");
  const [type, setType] = useState("Full-time");
  const [description, setDescription] = useState("");
  const [expiryDate, setExpiryDate] = useState(defaultExpiry());
  const [experienceRequired, setExperienceRequired] = useState(false);
  const [experienceDetails, setExperienceDetails] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (!user) return;
    if (canPost) return;
    const msg = employerPostBlockMessage(user);
    if (msg) setToast(msg);
  }, [user, canPost]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!canPost) {
      setToast(employerPostBlockMessage(user) || "You cannot post jobs yet.");
      return;
    }
    const company = user?.organization?.organizationName || "Organization";
    const orgCategory = user?.organization?.category;
    if (orgCategory !== "Government" && orgCategory !== "Private" && orgCategory !== "Foreign") {
      setError("Set your organization category (Government / Private / Foreign) before posting.");
      return;
    }
    if (experienceRequired && !experienceDetails.trim()) {
      setError("Enter the experience requirement when experience is required.");
      return;
    }
    const result = createJob({
      title,
      company,
      companyLogo: user?.organization?.logoUrl || "",
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
    router.push("/employer/jobs");
  }

  return (
    <div>
      <PageHeader
        title="Post a Job"
        subtitle="Job category is taken from your organization (Government / Private / Foreign)."
      />
      <TimedAlert message={toast} tone="warning" onHide={hideToast} />
      {canPost ? (
        <Card>
          <form className="grid gap-4 sm:grid-cols-2" onSubmit={onSubmit}>
            {error ? (
              <div className="sm:col-span-2">
                <Alert tone="danger">{error}</Alert>
              </div>
            ) : null}
            <div className="sm:col-span-2 rounded-lg border border-[#e5ebf5] bg-[#f8fafc] px-3 py-2 text-sm text-[#5b6b85]">
              Organization:{" "}
              <span className="font-medium text-[#1b2a4a]">
                {user?.organization?.organizationName || "—"}
              </span>
              {" · "}
              Category:{" "}
              <span className="font-medium text-[#1b2a4a]">
                {user?.organization?.category || "Not set"}
              </span>
            </div>
            <Input label="Job title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            <Input
              label="Location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              required
            />
            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Job type</span>
              <select
                className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                value={type}
                onChange={(e) => setType(e.target.value)}
              >
                {JOB_TYPES.map((t) => (
                  <option key={t} value={t}>
                    {t}
                  </option>
                ))}
              </select>
            </label>
            <Input
              label="Expiry date"
              type="date"
              value={expiryDate}
              onChange={(e) => setExpiryDate(e.target.value)}
              required
            />
            <label className="flex items-center gap-2 text-sm text-foreground sm:col-span-2">
              <input
                type="checkbox"
                checked={experienceRequired}
                onChange={(e) => setExperienceRequired(e.target.checked)}
              />
              Experience required to apply
            </label>
            {experienceRequired ? (
              <div className="sm:col-span-2">
                <Input
                  label="Experience requirement"
                  value={experienceDetails}
                  onChange={(e) => setExperienceDetails(e.target.value)}
                  placeholder="e.g. 2+ years in electrical work"
                  required
                />
              </div>
            ) : null}
            <label className="block space-y-1.5 text-sm text-foreground sm:col-span-2">
              <span className="font-medium">Description</span>
              <textarea
                className="min-h-[120px] w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />
            </label>
            <div className="sm:col-span-2">
              <Button type="submit">Publish Job</Button>
            </div>
          </form>
        </Card>
      ) : (
        <Card>
          <p className="text-sm text-[#5b6b85]">
            Complete your profile and wait for admin approval to post jobs. You will receive a
            notification when approved.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Button variant="secondary" onClick={() => router.push("/employer/organization")}>
              Complete organization
            </Button>
            <Button variant="secondary" onClick={() => router.push("/employer/jobs")}>
              Back to jobs
            </Button>
          </div>
        </Card>
      )}
    </div>
  );
}
