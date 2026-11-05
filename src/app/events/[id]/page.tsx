import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { getPortalEvent, PORTAL_EVENTS } from "@/lib/events";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return PORTAL_EVENTS.map((e) => ({ id: e.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const event = getPortalEvent(id);
  if (!event) return { title: "Event | NAVTTC Job Portal" };
  return {
    title: `${event.title} | Events | NAVTTC Job Portal`,
    description: event.summary,
  };
}

export default async function EventDetailPage({ params }: PageProps) {
  const { id } = await params;
  const event = getPortalEvent(id);
  if (!event) notFound();

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[840px]">
          <Link href="/events" className="text-sm font-medium text-[#2f4d9a] hover:underline">
            ← All events
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-[#e5ebf5] bg-white shadow-sm">
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={event.image}
                alt={event.title}
                fill
                priority
                className="object-cover object-center"
                sizes="840px"
              />
              <span className="absolute left-4 top-4 rounded-full bg-[#2f4d9a] px-2.5 py-1 text-[11px] font-semibold uppercase tracking-wide !text-white">
                {event.category}
              </span>
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                {event.title}
              </h1>
              <dl className="mt-4 grid gap-3 text-sm sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-[#1b2a4a]">Date</dt>
                  <dd className="text-[#6b7c99]">{event.date}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-[#1b2a4a]">Time</dt>
                  <dd className="text-[#6b7c99]">{event.time}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="font-semibold text-[#1b2a4a]">Location</dt>
                  <dd className="text-[#6b7c99]">{event.location}</dd>
                </div>
              </dl>
              <p className="mt-6 text-base leading-relaxed text-[#5b6b85]">{event.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register">
                  <Button>Register Now</Button>
                </Link>
                <Link href="/events">
                  <Button variant="secondary">Back to events</Button>
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
