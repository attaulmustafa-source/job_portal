"use client";

import { FormEvent, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PageHeader } from "@/components/layout/PageHeader";
import { StatusBadge } from "@/components/jobs/StatusBadge";
import { useAuth } from "@/lib/auth-store";

export default function CreateResumePage() {
  const router = useRouter();
  const { resumeTemplates, createResume } = useAuth();
  const activeTemplates = resumeTemplates.filter((t) => t.active);
  const [templateId, setTemplateId] = useState(activeTemplates[0]?.id || "");
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");

  const selected = activeTemplates.find((t) => t.id === templateId);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    const result = createResume({
      templateId,
      title: title.trim() || `${selected?.name || "Resume"} Resume`,
    });
    if (!result.ok || !result.resumeId) {
      setError(result.message);
      return;
    }
    router.push(`/seeker/resumes/${result.resumeId}`);
  }

  const missing = [
    !templateId ? "Template" : null,
    !title.trim() ? "Title" : null,
  ].filter(Boolean);

  return (
    <div>
      <PageHeader
        title="Create Resume"
        subtitle="Choose a template and start building your resume."
        actions={
          <Link href="/seeker/resumes">
            <Button variant="secondary">← Back</Button>
          </Link>
        }
      />

      <div className="rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm sm:p-6">
        {activeTemplates.length === 0 ? (
          <Alert tone="warning">
            No active templates. Ask an admin to activate a resume template.
          </Alert>
        ) : (
          <form className="grid gap-5 sm:grid-cols-2" onSubmit={onSubmit}>
            {error ? (
              <div className="sm:col-span-2">
                <Alert tone="danger">{error}</Alert>
              </div>
            ) : null}

            <label className="block space-y-1.5 text-sm text-foreground">
              <span className="font-medium">Template *</span>
              <select
                className="w-full rounded-md border border-border bg-white px-3 py-2 outline-none focus:border-primary"
                value={templateId}
                onChange={(e) => {
                  setTemplateId(e.target.value);
                  const tpl = activeTemplates.find((t) => t.id === e.target.value);
                  if (tpl && !title.trim()) setTitle(`${tpl.name} Resume`);
                }}
                required
              >
                {activeTemplates.map((tpl) => (
                  <option key={tpl.id} value={tpl.id}>
                    {tpl.name}
                  </option>
                ))}
              </select>
            </label>

            <Input
              label="Title *"
              placeholder="Enter resume title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            {selected ? (
              <div className="sm:col-span-2 rounded-lg border border-[#e5ebf5] bg-[#fafbfd] p-4">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-sm font-semibold text-[#1b2a4a]">{selected.name}</p>
                  <StatusBadge
                    label={selected.style.charAt(0).toUpperCase() + selected.style.slice(1)}
                    tone="info"
                  />
                </div>
                <p className="mt-1 text-xs text-[#6b7c99]">{selected.description}</p>
              </div>
            ) : null}

            <div className="sm:col-span-2 flex flex-col items-end gap-2 pt-2">
              {missing.length ? (
                <p className="text-right text-xs text-[#6b7c99]">Missing: {missing.join(", ")}</p>
              ) : null}
              <div className="flex flex-wrap justify-end gap-2">
                <Link href="/seeker/resumes">
                  <Button type="button" variant="secondary">
                    Cancel
                  </Button>
                </Link>
                <Button type="submit" disabled={missing.length > 0}>
                  Create
                </Button>
              </div>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
