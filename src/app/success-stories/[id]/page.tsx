import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { getSuccessStory, SUCCESS_STORIES } from "@/lib/success-stories";

type PageProps = {
  params: Promise<{ id: string }>;
};

export function generateStaticParams() {
  return SUCCESS_STORIES.map((s) => ({ id: s.id }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { id } = await params;
  const story = getSuccessStory(id);
  if (!story) return { title: "Success Story | NAVTTC Job Portal" };
  return {
    title: `${story.name} | Success Stories | NAVTTC Job Portal`,
    description: story.summary,
  };
}

export default async function SuccessStoryDetailPage({ params }: PageProps) {
  const { id } = await params;
  const story = getSuccessStory(id);
  if (!story) notFound();

  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main className="px-4 py-12 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[840px]">
          <Link
            href="/success-stories"
            className="text-sm font-medium text-[#2f4d9a] hover:underline"
          >
            ← All success stories
          </Link>

          <article className="mt-6 overflow-hidden rounded-2xl border border-[#e5ebf5] bg-white shadow-sm">
            <div className="relative h-56 w-full sm:h-72">
              <Image
                src={story.photo}
                alt={story.name}
                fill
                priority
                className="object-cover object-center"
                sizes="840px"
              />
            </div>
            <div className="p-6 sm:p-8">
              <h1 className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                {story.name}
              </h1>
              <p className="mt-2 text-sm font-medium text-[#2f4d9a]">
                {story.role} · {story.location}
              </p>
              <p className="mt-6 text-base leading-relaxed text-[#5b6b85]">{story.body}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href="/register?role=seeker">
                  <Button>Register as Job Seeker</Button>
                </Link>
                <Link href="/success-stories">
                  <Button variant="secondary">Back to stories</Button>
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
