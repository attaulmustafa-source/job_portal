"use client";

import { FormEvent, useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { CareerProfileForm } from "@/components/seeker/CareerProfileForm";
import { useAuth } from "@/lib/auth-store";
import {
  isSeekerProfileComplete,
  isSeekerSectionComplete,
} from "@/lib/profile";
import { emptySeekerProfile, normalizeSeekerProfile } from "@/lib/resume";
import {
  nextSeekerProfileSection,
  SEEKER_PROFILE_SECTIONS,
  type SeekerProfileSectionId,
} from "@/lib/seeker-profile-sections";
import type { SeekerProfile } from "@/lib/types";

function Chevron({ open }: { open: boolean }) {
  return (
    <span
      className={`flex h-8 w-8 items-center justify-center rounded-full border border-[#dbe3ef] bg-white text-[#2f4d9a] transition ${
        open ? "rotate-180" : ""
      }`}
      aria-hidden
    >
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
        <path
          d="M6 9l6 6 6-6"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </span>
  );
}

function firstIncompleteSection(profile?: SeekerProfile): SeekerProfileSectionId {
  for (const section of SEEKER_PROFILE_SECTIONS) {
    if (!isSeekerSectionComplete(section.id, profile)) return section.id;
  }
  return "profile";
}

export function SeekerProfileSectionPage({
  initialSection,
}: {
  initialSection?: SeekerProfileSectionId;
}) {
  const { user, updateSeekerProfile } = useAuth();
  const [form, setForm] = useState<SeekerProfile>(emptySeekerProfile());
  const [openSection, setOpenSection] = useState<SeekerProfileSectionId | null>(
    initialSection || "profile"
  );
  const [message, setMessage] = useState<{
    tone: "success" | "danger" | "info";
    text: string;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user?.seekerProfile) setForm(normalizeSeekerProfile(user.seekerProfile));
    else if (user) setForm(emptySeekerProfile());
  }, [user]);

  useEffect(() => {
    if (!user || initialized) return;
    setOpenSection(initialSection || firstIncompleteSection(user.seekerProfile));
    setInitialized(true);
  }, [user, initialSection, initialized]);

  const complete = isSeekerProfileComplete(user?.seekerProfile);

  const sectionStatus = useMemo(() => {
    const map = {} as Record<SeekerProfileSectionId, boolean>;
    for (const section of SEEKER_PROFILE_SECTIONS) {
      map[section.id] = isSeekerSectionComplete(section.id, form);
    }
    return map;
  }, [form]);

  function toggleSection(id: SeekerProfileSectionId) {
    setMessage(null);
    setOpenSection((current) => (current === id ? null : id));
  }

  function saveProfile() {
    const normalized = normalizeSeekerProfile(form);
    const result = updateSeekerProfile(normalized);
    setMessage({
      tone: result.ok ? "success" : "danger",
      text: result.message,
    });
    if (!result.ok) return;

    setForm(normalized);

    if (openSection && isSeekerSectionComplete(openSection, normalized)) {
      const next = nextSeekerProfileSection(openSection);
      setOpenSection(next);
      if (next) {
        setMessage({
          tone: "success",
          text: "Profile saved. Next section is open.",
        });
      }
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    saveProfile();
  }

  return (
    <div>
      <PageHeader
        title="Job Seeker Profile"
        actions={<Button onClick={saveProfile}>Save</Button>}
      />

      {message ? (
        <div className="mb-4">
          <Alert tone={message.tone}>{message.text}</Alert>
        </div>
      ) : null}

      {complete ? (
        <div className="mb-4">
          <Alert tone="success">
            Core profile and qualifications are complete. You can apply for jobs. Experience is only
            needed when a job requires it.
          </Alert>
        </div>
      ) : (
        <div className="mb-4">
          <Alert tone="warning">
            Add core profile details (name, CNIC, phone, city) and at least one qualification to
            unlock job applications. Other fields are optional for this demo.
          </Alert>
        </div>
      )}

      <div className="space-y-4">
        {SEEKER_PROFILE_SECTIONS.map((section) => {
          const open = openSection === section.id;
          const done = sectionStatus[section.id];
          return (
            <section
              key={section.id}
              className={`overflow-hidden rounded-xl border bg-white shadow-sm ${
                open ? "border-[#2f4d9a]" : "border-[#e5ebf5]"
              }`}
            >
              <button
                type="button"
                onClick={() => toggleSection(section.id)}
                className={`flex w-full items-center justify-between gap-3 px-5 py-4 text-left transition ${
                  open ? "bg-[#e8eefc]" : "bg-[#f4f7fc] hover:bg-[#e8eefc]"
                }`}
                aria-expanded={open}
              >
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="text-base font-semibold text-[#1b2a4a]">{section.title}</h2>
                    {section.must ? (
                      <span className="rounded-full bg-[#2f4d9a] px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Required
                      </span>
                    ) : (
                      <span className="rounded-full border border-[#dbe3ef] bg-white px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#6b7c99]">
                        Optional
                      </span>
                    )}
                    {done ? (
                      <span className="rounded-full bg-[#f9a825]/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-[#c4a035]">
                        Done
                      </span>
                    ) : null}
                  </div>
                  <p className="mt-1 text-sm text-[#6b7c99]">{section.subtitle}</p>
                </div>
                <Chevron open={open} />
              </button>

              {open ? (
                <div className="border-t border-[#e5ebf5] bg-white p-5">
                  <CareerProfileForm
                    section={section.id}
                    value={form}
                    accountEmail={user?.email || ""}
                    onChange={setForm}
                    onSubmit={onSubmit}
                    embedded
                    hideSave
                  />
                </div>
              ) : (
                <div className="border-t border-[#e5ebf5] bg-white px-5 py-8 text-center text-sm text-[#6b7c99]">
                  {done
                    ? "Completed. Open the toggle to edit this section."
                    : section.emptyMessage}
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
}
