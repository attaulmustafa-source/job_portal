import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { CAREER_ADVISORS, getCareerAdvisor } from "@/lib/career-advisors";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return CAREER_ADVISORS.map((a) => ({ id: a.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const advisor = getCareerAdvisor(id);
  if (!advisor) return { title: "Career Advisor | NAVTTC Job Portal" };
  return {
    title: `${advisor.name} | Career Advisors | NAVTTC Job Portal`,
    description: advisor.summary,
  };
}

export default async function CareerAdvisorDetailPage({ params }: PageProps) {
  const { id } = await params;
  const advisor = getCareerAdvisor(id);
  if (!advisor) notFound();

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[840px]">
          <Link
            href="/career-advisors"
            className="text-sm font-medium text-[#2f4d9a] hover:underline"
          >
            ← All career advisors
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-[#e5ebf5] bg-white shadow-sm">
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={advisor.photo}
                alt={advisor.name}
                fill
                priority
                className="object-cover object-center"
                sizes="840px"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                {advisor.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#2f4d9a]">{advisor.title}</p>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-[#1b2a4a]">Specialty</dt>
                  <dd className="text-[#6b7c99]">{advisor.specialty}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#1b2a4a]">Location</dt>
                  <dd className="text-[#6b7c99]">{advisor.location}</dd>
                </div>
              </dl>
              <p className="mt-6 text-base leading-relaxed text-[#5b6b85]">{advisor.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=seeker">
                  <Button>Register for Guidance</Button>
                </Link>
                <Link href="/career-advisors">
                  <Button variant="secondary">Back to advisors</Button>
                </Link>
              </div>
            </div>
          </article>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
