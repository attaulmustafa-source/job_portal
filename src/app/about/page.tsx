import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/Button";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { RevealHeading } from "@/components/landing/RevealHeading";

export const metadata: Metadata = {
  title: "About Us | NAVTTC Job Portal",
  description:
    "Committed to lifelong learning — leadership, values, journey, and why the NAVTTC Job Portal network.",
};

const VALUES = [
  {
    title: "Integrity",
    text: "We uphold the highest standards of integrity in all our actions.",
  },
  {
    title: "Innovation",
    text: "We foster a culture of creativity and innovation in teaching and learning.",
  },
  {
    title: "Excellence",
    text: "Processes serve people, not the other way around.",
  },
  {
    title: "Diversity",
    text: "We choose action over passiveness.",
  },
  {
    title: "Community",
    text: "We approach everyone with respect and do not get fooled by appearances.",
  },
] as const;

const JOURNEY = [
  {
    year: "1990",
    text: "Founded with a vision to provide world-class education in Pakistan.",
  },
  {
    year: "2000",
    text: "Expanded our academic programs to include technology and business disciplines.",
  },
  {
    year: "2010",
    text: "Achieved accreditation and recognition for excellence in education.",
  },
  {
    year: "2020",
    text: "Launched innovative online learning platforms to adapt to modern educational needs.",
  },
] as const;

const WHY_CHOOSE = [
  {
    title: "Expert Faculty",
    text: "Learn from industry leaders and accomplished academics.",
  },
  {
    title: "State-of-the-Art",
    text: "Access to modern classrooms, labs, and libraries.",
  },
  {
    title: "Global Network",
    text: "Join a diverse community with connections across the world.",
  },
  {
    title: "Career Support",
    text: "Benefit from our strong industry ties and career services.",
  },
  {
    title: "Innovative Programs",
    text: "Engage in cutting-edge programs designed for future success.",
  },
] as const;

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main>
        <section id="about" className="border-b border-[#e5ebf5] bg-white px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading
                as="h1"
                className="text-3xl font-bold tracking-tight text-[#0f2a3d] sm:text-4xl"
              >
                About Us
              </RevealHeading>
              <p className="mt-3 text-base font-medium text-[#2f4d9a] sm:text-lg">
                Committed to Lifelong Learning
              </p>
            </div>

            <div className="mt-12 grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
              <div className="relative mx-auto aspect-[4/5] w-full max-w-md overflow-hidden rounded-2xl bg-[#2f4d9a] sm:max-w-lg">
                <Image
                  src="/landing/ceo-qadeer.png"
                  alt="Dr. Qadeer Ahmad, President & CEO"
                  fill
                  priority
                  className="object-cover object-top"
                  sizes="(max-width: 1024px) 100vw, 480px"
                />
              </div>
              <div>
                <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                  Dr. Qadeer Ahmad
                </RevealHeading>
                <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-[#2f4d9a]">
                  President &amp; CEO
                </p>
                <p className="mt-5 text-base leading-relaxed text-[#5b6b85]">
                  Dr. Qadeer Ahmad, with over 20 years of pioneering leadership in education, has
                  been the driving force behind fostering innovation and excellence within the
                  Alumni Network. His vision continues to shape the future of our community,
                  creating opportunities for alumni to grow, connect, and thrive.
                </p>
                <div className="mt-8">
                  <Link href="/career-advisors">
                    <Button variant="landing">View more</Button>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="border-b border-[#eef2f7] bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                Our Core Values
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                Our vision is to be a leading institution of higher learning, recognized for our
                commitment to excellence, innovation, and social responsibility, preparing future
                leaders for a rapidly changing world.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {VALUES.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[#e5ebf5] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8eef8] text-sm font-bold text-[#2f4d9a]">
                    {item.title.charAt(0)}
                  </div>
                  <h3 className="mt-4 text-base font-semibold text-[#0f2a3d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7c99]">{item.text}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="border-b border-[#eef2f7] bg-white px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                Our Journey
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                Our vision is to be a leading institution of higher learning, recognized for our
                commitment to excellence, innovation, and social responsibility, preparing future
                leaders for a rapidly changing world.
              </p>
            </div>
            <ol className="relative mx-auto mt-12 max-w-3xl space-y-8 border-l-2 border-[#e5ebf5] pl-8">
              {JOURNEY.map((item) => (
                <li key={item.year} className="relative">
                  <span
                    className="absolute -left-[2.4rem] mt-1.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-[#2f4d9a] shadow"
                    aria-hidden
                  />
                  <p className="text-lg font-bold text-[#2f4d9a]">{item.year}</p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5b6b85]">{item.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        <section className="bg-[#f3f5f9] px-4 py-14 sm:px-6 sm:py-16">
          <div className="mx-auto max-w-[1200px]">
            <div className="mx-auto max-w-2xl text-center">
              <RevealHeading className="text-2xl font-bold tracking-tight text-[#0f2a3d] sm:text-3xl">
                Why Choose Alumni Network
              </RevealHeading>
              <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
                Our vision is to be a leading institution of higher learning, recognized for our
                commitment to excellence, innovation, and social responsibility, preparing future
                leaders for a rapidly changing world.
              </p>
            </div>
            <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {WHY_CHOOSE.map((item) => (
                <article
                  key={item.title}
                  className="rounded-2xl border border-[#e5ebf5] bg-white p-6 shadow-sm transition duration-200 hover:-translate-y-1 hover:shadow-md"
                >
                  <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-[#e8eef8] text-[#2f4d9a]">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                      <path
                        d="M12 3l2.2 4.5 5 .7-3.6 3.5.9 5L12 14.8 7.5 16.7l.9-5L4.8 8.2l5-.7L12 3z"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                  <h3 className="mt-4 text-base font-semibold text-[#0f2a3d]">{item.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#6b7c99]">{item.text}</p>
                </article>
              ))}
            </div>
            <div className="mt-10 text-center">
              <Link href="/register">
                <Button variant="landing">Join the Network</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <LandingFooter />
    </div>
  );
}
