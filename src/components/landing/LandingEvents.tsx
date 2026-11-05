import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { RevealHeading } from "@/components/landing/RevealHeading";
import { getFeaturedEvents } from "@/lib/events";

export function LandingEvents() {
  const events = getFeaturedEvents(2);

  return (
    <section
      id="events"
      className="scroll-mt-20 border-b border-[#eef2f7] bg-white px-4 py-14 sm:px-6 sm:py-16"
    >
      <div className="mx-auto max-w-[1200px]">
        <div className="mx-auto max-w-2xl text-center">
          <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
            Upcoming Events
          </RevealHeading>
          <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
            Job fairs, counselling drives, and employer sessions across Pakistan.
          </p>
        </div>

        <div className="mt-10 grid items-stretch gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative min-h-[280px] overflow-hidden rounded-2xl sm:min-h-[360px] lg:min-h-full">
            <Image
              src="/landing/event-hero.jpg"
              alt="Professionals at a career event"
              fill
              className="object-cover object-center"
              sizes="(max-width: 1024px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1b2a4a]/70 via-[#1b2a4a]/15 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8">
              <p className="text-lg font-semibold text-white sm:text-xl">
                Connect. Learn. Get hired.
              </p>
              <p className="mt-1 text-sm text-white/85">
                National events bringing seekers and employers together.
              </p>
            </div>
          </div>

          <div className="flex flex-col gap-4">
            {events.map((event) => (
              <article
                key={event.id}
                className="flex flex-col gap-4 rounded-2xl border border-[#e5ebf5] bg-[#f8fafc] p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md sm:flex-row sm:items-center sm:p-5"
              >
                <div className="relative mx-auto h-28 w-28 shrink-0 overflow-hidden rounded-xl sm:mx-0 sm:h-24 sm:w-24">
                  <Image
                    src={event.image}
                    alt={event.title}
                    fill
                    className="object-cover object-center"
                    sizes="112px"
                  />
                </div>
                <div className="min-w-0 flex-1 text-center sm:text-left">
                  <p className="text-[11px] font-semibold uppercase tracking-wide text-[#2f4d9a]">
                    {event.category}
                  </p>
                  <h3 className="mt-1 text-base font-semibold text-[#0f2a3d]">{event.title}</h3>
                  <p className="mt-0.5 text-xs font-medium text-[#5b6b85]">
                    {event.date} · {event.location}
                  </p>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7c99]">{event.summary}</p>
                  <div className="mt-3">
                    <Link href={`/events/${event.id}`}>
                      <Button variant="secondary">Read more</Button>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
            <div className="pt-1 text-center sm:text-left">
              <Link href="/events">
                <Button variant="landing">View all events</Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
