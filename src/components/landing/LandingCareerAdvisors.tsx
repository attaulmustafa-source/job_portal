import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/landing/RevealHeading";
import { getFeaturedCareerAdvisors } from "@/lib/career-advisors";

export function LandingCareerAdvisors() {
  const advisors = getFeaturedCareerAdvisors(2);

  return (
    <section
      id="counselling"
      className="scroll-mt-20 border-b border-[#eef2f7] bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
            Meet Our Career Advisors
          </RevealHeading>
          <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
            Get to know the dedicated professionals behind Network success.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[360px] lg:min-h-full">
            <Image
              src="/landing/advisor-hero.jpg"
              alt="Career advisor guiding a professional"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b2a4a]/70 via-[#1b2a4a]/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-lg font-semibold text-white sm:text-xl">
                Guidance that gets results.
              </p>
              <p className="mt-1 text-sm text-white/85">
                Expert advisors helping seekers prepare and place.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {advisors.map((advisor) => (
              <article
                key={advisor.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#e5ebf5] bg-white p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:h-24 sm:w-24">
                  <Image
                    src={advisor.photo}
                    alt={advisor.name}
                    fill
                    className="object-cover object-center"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <h3 className="text-base font-semibold text-[#0f2a3d]">{advisor.name}</h3>
                  <p className="mt-0.5 text-xs font-medium text-[#2f4d9a]">
                    {advisor.title} · {advisor.specialty}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7c99]">{advisor.summary}</p>
                  <div className="mt-3">
                    <Link href={`/career-advisors/${advisor.id}`}>
                      <Button variant="secondary">Read more</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            <div className="pt-1 text-center sm:text-left">
              <Link href="/career-advisors">
                <Button variant="landing">View all advisors</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
