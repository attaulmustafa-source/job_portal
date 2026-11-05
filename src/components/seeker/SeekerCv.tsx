"use client";

import { ResumePreview } from "@/components/resume/ResumePreview";
import { useAuth } from "@/lib/auth-store";
import { contentFromProfile } from "@/lib/resume";
import type { UserAccount } from "@/lib/types";

export function SeekerCv({ seeker }: { seeker: UserAccount }) {
  const { resumes, resumeTemplates } = useAuth();
  const latest = resumes
    .filter((r) => r.seekerId === seeker.id)
    .sort((a, b) => b.updatedAt.localeCompare(a.updatedAt))[0];
  const template = resumeTemplates.find((t) => t.id === latest?.templateId);

  if (latest) {
    return (
      <div className="space-y-3">
        <p className="text-sm text-muted">
          Showing saved resume: <strong className="text-foreground">{latest.title}</strong>
        </p>
        <ResumePreview content={latest.content} style={template?.style || "classic"} />
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted">
        No saved resume yet. Showing profile-based CV preview.
      </p>
      <ResumePreview
        content={contentFromProfile(seeker.email, seeker.seekerProfile)}
        style="classic"
      />
    </div>
  );
}
