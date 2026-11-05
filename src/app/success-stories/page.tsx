import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { RevealHeading } from "@/components/landing/RevealHeading";
import { SUCCESS_STORIES } from "@/lib/success-stories";

export const metadata: Metadata = {
  title: "Success Stories | NAVTTC Job Portal",
  description:
    "Hire Talent — success stories from NAVTTC Pakistan graduates and job seekers.",
};

export default function SuccessStoriesPage() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main>
        <section className="border-b border-[#e5ebf5] bg-white">
          <div className="mx-auto grid max-w-[1200px] items-stretch lg:grid-cols-2">
            <div className="flex flex-col justify-center px-4 py-12 sm:px-8 sm:py-16 lg:px-10">
              <p className="text-sm font-semibold uppercase tracking-wide text-[#2f4d9a]">
                NAVTTC Pakistan
              </p>
              <RevealHeading
                as="h1"
                className="mt-2 text-3xl font-bold tracking-tight text-[#0f2a3d] sm:text-4xl"
              >
                Success Stories
              </RevealHeading>
              <p className="mt-4 max-w-lg text-base leading-relaxed text-[#5b6b85]">
                Hire Talent — stories from NAVTTC Pakistan. Real careers built through
                training, counselling, and the national Job Portal.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=seeker">
                  <Button variant="landing">Start Your Journey</Button>
                </Link>
                <Link href="/#jobs">
                  <Button variant="landingSecondary">Browse Jobs</Button>
                </Link>
              </div>
            </div>
            <div className="relative min-h-[240px] sm:min-h-[320px] lg:min-h-[380px]">
              <Image
                src="/landing/success-trophy.jpg"
                alt="Trophy celebrating career success"
                fill
                priority
                className="object-cover object-center"
                sizes="(max-width: 1024px) 100vw, 50vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1b2a4a]/55 via-transparent to-transparent lg:bg-gradient-to-r lg:from-[#f3f5f9]/40 lg:via-transparent lg:to-transparent" />
            </div>
          </div>
        </section>

        <section className="px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                Inspiring journeys
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                Meet graduates and professionals who found opportunity through NAVTTC.
              </p>
            </div>

            <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {SUCCESS_STORIES.map((story) => (
                <article
                  key={story.id}
                  className="flex flex-col overflow-hidden rounded-2xl border border-[#e5ebf5] bg-white shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="relative h-48 w-full">
                    <Image
                      src={story.photo}
                      alt={story.name}
                      fill
                      className="object-cover object-center"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  </div>
                  <div className="flex flex-1 flex-col p-5">
                    <h3 className="text-lg font-semibold text-[#0f2a3d]">{story.name}</h3>
                    <p className="mt-1 text-xs font-medium text-[#2f4d9a]">
                      {story.role} · {story.location}
                    </p>
                    <p className="mt-3 flex-1 text-sm leading-relaxed text-[#6b7c99]">
                      {story.summary}
                    </p>
                    <div className="mt-5">
                      <Link href={`/success-stories/${story.id}`}>
                        <Button variant="secondary" fullWidth>
                          Read more
                        </Button>
                      </Link>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
