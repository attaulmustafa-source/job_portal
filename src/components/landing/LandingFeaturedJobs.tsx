"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, type ReactNode } from "react";
import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/landing/RevealHeading";

type JobCategory = "Government" | "Private" | "Foreign";

type FeaturedJob = {
  id: string;
  title: string;
  organization: string;
  category: JobCategory;
  deadline: string;
  location: string;
  employmentScale: string;
  vacancies: string;
};

const FEATURED_JOBS: FeaturedJob[] = [
  {
    id: "gov-1",
    title: "Resource Persons",
    organization: "National Vocational And Technical Training Commission (NAVTTC)",
    category: "Government",
    deadline: "11/10/2026",
    location: "Lahore and Islamabad",
    employmentScale: "Short-term",
    vacancies: "6",
  },
  {
    id: "gov-2",
    title: "Short Term Expert (Media Coordination & Content Writer)",
    organization: "National Vocational And Technical Training Commission (NAVTTC)",
    category: "Government",
    deadline: "As displayed",
    location: "Islamabad",
    employmentScale: "Short-term",
    vacancies: "As displayed",
  },
  {
    id: "gov-3",
    title: "TVET Instructor (Technical Trades)",
    organization: "National Vocational And Technical Training Commission (NAVTTC)",
    category: "Government",
    deadline: "As displayed",
    location: "Karachi",
    employmentScale: "Short-term",
    vacancies: "As displayed",
  },
  {
    id: "pri-1",
    title: "Software Development Associate",
    organization: "Private Technology Partners",
    category: "Private",
    deadline: "As displayed",
    location: "Lahore",
    employmentScale: "Full-time",
    vacancies: "As displayed",
  },
  {
    id: "pri-2",
    title: "Electrical Safety Wiring Technician",
    organization: "Industrial Solutions Pvt. Ltd.",
    category: "Private",
    deadline: "As displayed",
    location: "Faisalabad",
    employmentScale: "Contract",
    vacancies: "As displayed",
  },
  {
    id: "pri-3",
    title: "HR & Recruitment Officer",
    organization: "National Skills Employers Network",
    category: "Private",
    deadline: "As displayed",
    location: "Islamabad",
    employmentScale: "Full-time",
    vacancies: "As displayed",
  },
  {
    id: "for-1",
    title: "Skilled Technician (Overseas Placement)",
    organization: "Gulf Workforce Partners",
    category: "Foreign",
    deadline: "As displayed",
    location: "UAE",
    employmentScale: "Contract",
    vacancies: "As displayed",
  },
  {
    id: "for-2",
    title: "Hospitality Staff (International)",
    organization: "Overseas Employment Facilitators",
    category: "Foreign",
    deadline: "As displayed",
    location: "Qatar",
    employmentScale: "Contract",
    vacancies: "As displayed",
  },
  {
    id: "for-3",
    title: "Construction Supervisor (Abroad)",
    organization: "International Project Services",
    category: "Foreign",
    deadline: "As displayed",
    location: "Saudi Arabia",
    employmentScale: "Contract",
    vacancies: "As displayed",
  },
];

const TABS: JobCategory[] = ["Government", "Private", "Foreign"];

function IconCalendar() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#2f4d9a]">
      <rect x="3.5" y="5" width="17" height="15" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="M8 3.5V7M16 3.5V7M3.5 10h17" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#2f4d9a]">
      <path
        d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

function IconLayers() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#2f4d9a]">
      <path
        d="M12 3.5 3.5 8 12 12.5 20.5 8 12 3.5Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <path d="M3.5 12.5 12 17l8.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M3.5 16.5 12 21l8.5-4.5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPeople() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden className="shrink-0 text-[#2f4d9a]">
      <circle cx="9" cy="8" r="2.5" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="16" cy="9" r="2" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M3.5 18c1.2-2.5 3-3.8 5.5-3.8S13.3 15.5 14.5 18"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
      <path
        d="M14 14.5c1.4-.4 2.7-.3 4 .8.7.6 1.2 1.5 1.5 2.7"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  );
}

function Detail({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2">
      {icon}
      <div className="min-w-0">
        <p className="text-xs font-semibold text-[#1b2a4a]">{label}</p>
        <p className="text-xs text-[#6b7c99]">{value}</p>
      </div>
    </div>
  );
}

export function LandingFeaturedJobs() {
  const [tab, setTab] = useState<JobCategory>("Government");
  const jobs = FEATURED_JOBS.filter((j) => j.category === tab).slice(0, 3);

  return (
    <section
      id="jobs"
      className="scroll-mt-20 border-b border-[#eef2f7] bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
            Featured Job Opportunities
          </RevealHeading>
          <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
            Browse openings by sector — Government, Private, and Foreign.
          </p>
        </div>

        <div
          className="mx-auto mt-8 flex max-w-lg items-center justify-center gap-1 rounded-lg border border-[#e5ebf5] bg-white p-1"
          role="tablist"
          aria-label="Job categories"
        >
          {TABS.map((t) => {
            const active = tab === t;
            return (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setTab(t)}
                className={`flex-1 rounded-md px-3 py-2 text-sm font-medium transition ${
                  active
                    ? "bg-[#2f4d9a] !text-white shadow-sm"
                    : "text-[#5b6b85] hover:bg-[#f5f8fc] hover:text-[#1b2a4a]"
                }`}
              >
                {t}
              </button>
            );
          })}
        </div>

        <div className="mt-8 grid gap-5 lg:grid-cols-3">
          {jobs.map((job) => (
            <article
              key={job.id}
              className="flex flex-col rounded-2xl border border-[#e5ebf5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-xl border border-[#e5ebf5] bg-white">
                  <Image
                    src="/navttc-logo.png"
                    alt="NAVTTC"
                    width={40}
                    height={40}
                    className="h-9 w-9 object-contain"
                  />
                </div>
                <div className="flex flex-wrap justify-end gap-1.5">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e8eef8] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f4d9a]">
                    <span className="h-1.5 w-1.5 rounded-full bg-[#2f4d9a]" aria-hidden />
                    Live
                  </span>
                  <span className="inline-flex items-center rounded-full border border-[#2f4d9a]/40 bg-white px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide text-[#2f4d9a]">
                    {job.category}
                  </span>
                </div>
              </div>

              <h3 className="mt-4 text-lg font-bold leading-snug text-[#0f2a3d]">{job.title}</h3>
              <p className="mt-1 line-clamp-2 text-sm font-medium text-[#6b7c99]">
                {job.organization}
              </p>

              <div className="my-4 border-t border-[#eef2f7]" />

              <div className="grid grid-cols-2 gap-x-3 gap-y-4">
                <Detail icon={<IconCalendar />} label="Deadline" value={job.deadline} />
                <Detail icon={<IconPin />} label="Location" value={job.location} />
                <Detail icon={<IconLayers />} label="Scale" value={job.employmentScale} />
                <Detail icon={<IconPeople />} label="Vacancies" value={job.vacancies} />
              </div>

              <div className="mt-auto flex flex-col gap-2 pt-5 sm:flex-row">
                <Link href="/login" className="flex-1">
                  <Button variant="landing" fullWidth>
                    Sign in to apply
                  </Button>
                </Link>
                <Link href="/login" className="flex-1">
                  <Button variant="secondary" fullWidth>
                    View details
                  </Button>
                </Link>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-8 text-center">
          <Link href="/login">
            <Button variant="landing">View All Jobs</Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
