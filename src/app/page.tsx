import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { HeroHeadline } from "@/components/landing/HeroHeadline";
import { LandingFeaturedJobs } from "@/components/landing/LandingFeaturedJobs";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingCareerAdvisors } from "@/components/landing/LandingCareerAdvisors";
import { LandingEvents } from "@/components/landing/LandingEvents";
import { LandingSuccessStories } from "@/components/landing/LandingSuccessStories";
import { LandingTrustedEmployers } from "@/components/landing/LandingTrustedEmployers";
import { RevealHeading } from "@/components/landing/RevealHeading";

export const metadata: Metadata = {
  title: "NAVTTC Job Portal | Career Counselling & Job Placement",
  description:
    "One national platform connecting job seekers and employers — discover opportunities that shape your future.",
};

const STATIC_STATS = [
  { label: "Cumulative Jobs", value: "3,200+" },
  { label: "Cumulative Employers", value: "850+" },
  { label: "Total Job Seekers", value: "12,500+" },
  { label: "Overseas Jobs", value: "420+" },
  { label: "Government Jobs", value: "1,100+" },
  { label: "Private Jobs", value: "1,680+" },
] as const;

const OPPORTUNITIES = [
  { title: "Software Development", blurb: "Web, mobile, and IT roles" },
  { title: "Safety Wiring", blurb: "Electrical & industrial safety" },
  { title: "Healthcare", blurb: "Clinical and support careers" },
  { title: "Engineering", blurb: "Civil, mechanical, and more" },
  { title: "Construction", blurb: "Building and site trades" },
  { title: "Hospitality", blurb: "Hotels, tourism, and service" },
  { title: "Business & Finance", blurb: "Accounting, admin, banking" },
  { title: "Education", blurb: "Teaching and training roles" },
] as const;

const SEEKER_STEPS = [
  {
    step: "01",
    title: "Create Account",
    text: "Register with confidence and security.",
  },
  {
    step: "02",
    title: "Create Resume",
    text: "Develop a comprehensive resume.",
  },
  {
    step: "03",
    title: "Find Jobs",
    text: "Search for suitable job opportunities.",
  },
  {
    step: "04",
    title: "Apply Jobs",
    text: "Submit applications confidently and securely.",
  },
] as const;

const EMPLOYER_STEPS = [
  {
    step: "01",
    title: "Create Account",
    text: "Register with confidence and security.",
  },
  {
    step: "02",
    title: "Build Profile",
    text: "Develop a comprehensive employer profile.",
  },
  {
    step: "03",
    title: "Post Jobs",
    text: "Advertise your job openings.",
  },
  {
    step: "04",
    title: "Hire Talent",
    text: "Select the best candidates.",
  },
] as const;

export default function HomePage() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main>
        <section
          id="home"
          className="scroll-mt-20 overflow-hidden border-b border-[#e5ebf5] bg-[#f3f5f9]"
        >
          <div className="mx-auto grid max-w-[1280px] items-stretch lg:grid-cols-2">
            <div className="flex flex-col justify-center px-4 py-14 sm:px-8 sm:py-16 lg:px-10 lg:py-20">
              <HeroHeadline />
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5b6b85] sm:text-lg">
                One national platform connecting job seekers and employers — discover
                opportunities that shape your future.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#jobs">
                  <Button variant="landing">Find Jobs</Button>
                </a>
                <Link href="/register">
                  <Button variant="landingSecondary">Hire Talent</Button>
                </Link>
              </div>
            </div>

            <div className="relative min-h-[260px] sm:min-h-[340px] lg:min-h-[420px]">
              <Image
                src="/landing/hero-workforce.jpg"
                alt="Professionals collaborating in a modern workplace"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div
                className="pointer-events-none absolute inset-y-0 left-0 w-16 bg-gradient-to-r from-[#f3f5f9] to-transparent lg:w-24"
                aria-hidden
              />
            </div>
          </div>
        </section>

        <section id="stats" className="scroll-mt-20 bg-[#2f4d9a] px-4 py-16 sm:px-6 sm:py-20">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center text-white">
              <RevealHeading className="text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
                Platform Statistics
              </RevealHeading>
              <p className="mt-3 text-sm text-white/85 sm:text-base">
                Real-time insight into Pakistan&apos;s national employment exchange.
              </p>
            </div>
            <div className="mt-12 grid gap-10 sm:grid-cols-2 lg:grid-cols-3 lg:gap-x-8 lg:gap-y-12">
              {STATIC_STATS.map((stat) => (
                <div key={stat.label} className="text-center text-white">
                  <p className="text-4xl font-bold tracking-tight sm:text-5xl">{stat.value}</p>
                  <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section
          id="opportunities"
          className="scroll-mt-20 border-b border-[#eef2f7] bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16"
        >
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                Explore Opportunities
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                Discover jobs across skills and trades — from software to safety wiring and beyond.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {OPPORTUNITIES.map((item) => (
                <Link
                  key={item.title}
                  href="/login"
                  className="group rounded-xl border border-[#e5ebf5] bg-white p-5 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-[#2f4d9a]/35 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8eef8] text-[#2f4d9a] transition group-hover:bg-[#2f4d9a] group-hover:!text-white">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <rect
                        x="3"
                        y="7"
                        width="18"
                        height="13"
                        rx="2"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                      <path
                        d="M8 7V5.5A1.5 1.5 0 0 1 9.5 4h5A1.5 1.5 0 0 1 16 5.5V7"
                        stroke="currentColor"
                        strokeWidth="1.6"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-sm font-semibold text-[#1b2a4a] sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1 text-xs text-[#6b7c99] sm:text-sm">{item.blurb}</p>
                </Link>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Link href="/login">
                <Button variant="landing">Browse All Jobs</Button>
              </Link>
            </div>
          </div>
        </section>

        <LandingFeaturedJobs />

        <section
          id="seeker-guide"
          className="scroll-mt-20 border-b border-[#eef2f7] bg-white px-4 py-14 sm:px-6 sm:py-16"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[360px]">
              <Image
                src="/landing/seeker-howto-pro2.jpg"
                alt="Professional job seeker in formal business attire"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
            <div>
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                How it works for Job Seekers
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                If you&apos;re seeking the right job, follow these steps.
              </p>
              <ol className="mt-8 space-y-5">
                {SEEKER_STEPS.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eef8] text-sm font-bold text-[#2f4d9a]">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#1b2a4a]">{item.title}</h3>
                      <p className="mt-0.5 text-sm text-[#6b7c99]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link href="/register?role=seeker">
                  <Button variant="landing">Register Now</Button>
                </Link>
              </div>
            </div>
          </div>
        </section>

        <section
          id="employer-guide"
          className="scroll-mt-20 border-b border-[#eef2f7] bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16"
        >
          <div className="mx-auto grid max-w-[1200px] items-center gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                How it works for Employers
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                If you&apos;re seeking the right candidate, follow these steps.
              </p>
              <ol className="mt-8 space-y-5">
                {EMPLOYER_STEPS.map((item) => (
                  <li key={item.step} className="flex gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#e8eef8] text-sm font-bold text-[#2f4d9a]">
                      {item.step}
                    </span>
                    <div>
                      <h3 className="text-base font-semibold text-[#1b2a4a]">{item.title}</h3>
                      <p className="mt-0.5 text-sm text-[#6b7c99]">{item.text}</p>
                    </div>
                  </li>
                ))}
              </ol>
              <div className="mt-8">
                <Link href="/register?role=employer">
                  <Button variant="landing">Register Now</Button>
                </Link>
              </div>
            </div>
            <div className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[360px]">
              <Image
                src="/landing/employer-howto-pro.jpg"
                alt="Professional employer in formal business attire"
                fill
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
            </div>
          </div>
        </section>

        <LandingTrustedEmployers />

        <LandingSuccessStories />

        <LandingEvents />

        <LandingCareerAdvisors />
      </main>

      <LandingFooter />
    </div>
  );
}
