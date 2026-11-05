"use client";

import { useEffect, useMemo, useState } from "react";
import { Alert } from "@/components/ui/Alert";
import { Button } from "@/components/ui/Button";
import { PageHeader } from "@/components/layout/PageHeader";
import { EmployerOrganizationForm } from "@/components/employer/EmployerOrganizationForm";
import { useAuth } from "@/lib/auth-store";
import { isOrganizationComplete } from "@/lib/profile";
import {
  EMPLOYER_ORG_SECTIONS,
  emptyOrganization,
  isEmployerOrgSectionComplete,
  nextEmployerOrgSection,
  normalizeOrganization,
  type EmployerOrgSectionId,
} from "@/lib/organization";
import type { OrganizationDetails } from "@/lib/types";

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

function firstIncompleteSection(org?: OrganizationDetails): EmployerOrgSectionId {
  for (const section of EMPLOYER_ORG_SECTIONS) {
    if (!isEmployerOrgSectionComplete(section.id, org)) return section.id;
  }
  return "basic";
}

export function EmployerProfileAccordion() {
  const { user, updateOrganization } = useAuth();
  const [form, setForm] = useState<OrganizationDetails>(emptyOrganization());
  const [openSection, setOpenSection] = useState<EmployerOrgSectionId | null>("basic");
  const [message, setMessage] = useState<{
    tone: "success" | "danger" | "info";
    text: string;
  } | null>(null);
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (user?.organization) {
      const org = normalizeOrganization(user.organization);
      if (!org.focalPersonName && user.employerProfile?.contactName) {
        org.focalPersonName = user.employerProfile.contactName;
      }
      if (!org.focalPersonPhone && user.employerProfile?.phone) {
        org.focalPersonPhone = user.employerProfile.phone;
      }
      if (!org.focalPersonDesignation && user.employerProfile?.designation) {
        org.focalPersonDesignation = user.employerProfile.designation;
      }
      setForm(org);
    } else if (user) {
      setForm(emptyOrganization());
    }
  }, [user]);

  useEffect(() => {
    if (!user || initialized) return;
    setOpenSection(firstIncompleteSection(user.organization));
    setInitialized(true);
  }, [user, initialized]);

  const complete = isOrganizationComplete(user?.organization);

  const sectionStatus = useMemo(() => {
    const map = {} as Record<EmployerOrgSectionId, boolean>;
    for (const section of EMPLOYER_ORG_SECTIONS) {
      map[section.id] = isEmployerOrgSectionComplete(section.id, form);
    }
    return map;
  }, [form]);

  function toggleSection(id: EmployerOrgSectionId) {
    setMessage(null);
    setOpenSection((current) => (current === id ? null : id));
  }

  function saveProfile() {
    const normalized = normalizeOrganization(form);
    const result = updateOrganization(normalized);
    setForm(normalized);
    setMessage({
      tone: result.ok ? "success" : "danger",
      text: result.message,
    });

    if (!result.ok) return;

    if (result.submitted) {
      setOpenSection(null);
      return;
    }

    if (openSection && isEmployerOrgSectionComplete(openSection, normalized)) {
      const next = nextEmployerOrgSection(openSection);
      setOpenSection(next);
      if (next) {
        setMessage({
          tone: "success",
          text: "Section saved. Next section is open. Complete all fields, then Save to submit for approval.",
        });
      }
    }
  }

  return (
    <div>
      <PageHeader
        title="Employer Profile"
        actions={<Button onClick={saveProfile}>Save</Button>}
      />

      {message ? (
        <div className="mb-4">
          <Alert tone={message.tone}>{message.text}</Alert>
        </div>
      ) : null}

      {user?.employerApproval === "pending" ? (
        <div className="mb-4">
          <Alert tone="info">Your profile is pending admin approval.</Alert>
        </div>
      ) : user?.employerApproval === "approved" ? (
        <div className="mb-4">
          <Alert tone="success">Your employer account is approved.</Alert>
        </div>
      ) : complete ? (
        <div className="mb-4">
          <Alert tone="success">
            All fields are complete. Click Save to submit for admin approval.
          </Alert>
        </div>
      ) : (
        <div className="mb-4">
          <Alert tone="warning">
            Every field in every section is required. When complete, Save will submit for approval.
          </Alert>
        </div>
      )}

      <div className="space-y-4">
        {EMPLOYER_ORG_SECTIONS.map((section) => {
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
                  <EmployerOrganizationForm
                    section={section.id}
                    value={form}
                    onChange={setForm}
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
