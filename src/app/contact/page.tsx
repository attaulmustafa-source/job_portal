import type { Metadata } from "next";
import { ContactForm } from "@/components/landing/ContactForm";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHeader } from "@/components/landing/LandingHeader";

export const metadata: Metadata = {
  title: "Contact Us | NAVTTC Job Portal",
  description: "Let’s create progress together — contact the NAVTTC Job Portal team.",
};

function IconMail() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#2f4d9a]">
      <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1.6" />
      <path d="m4 7 8 6 8-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPhone() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#2f4d9a]">
      <path
        d="M7.5 3.5h3l1.5 4-2 1.5a12 12 0 0 0 5 5l1.5-2 4 1.5v3a2 2 0 0 1-2.2 2A15.5 15.5 0 0 1 3.5 5.7 2 2 0 0 1 5.5 3.5h2z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconClock() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#2f4d9a]">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.6" />
      <path d="M12 7.5V12l3 2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}

function IconPin() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden className="text-[#2f4d9a]">
      <path
        d="M12 21s-6-5.2-6-10a6 6 0 1 1 12 0c0 4.8-6 10-6 10z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <circle cx="12" cy="11" r="2.2" stroke="currentColor" strokeWidth="1.6" />
    </svg>
  );
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-[#f3f5f9] text-[#1b2a4a]">
      <LandingHeader />

      <main className="px-4 py-14 sm:px-6 sm:py-16">
        <div className="mx-auto max-w-[1200px]">
          <div className="mx-auto max-w-2xl text-center">
            <h1 className="text-3xl font-bold tracking-tight text-[#0f2a3d] sm:text-4xl">
              Let&apos;s Create
              <br className="sm:hidden" /> Progress Together
            </h1>
            <p className="mt-3 text-sm text-[#5b6b85] sm:text-base">
              We&apos;re here to help and answer any questions you may have.
            </p>
          </div>

          <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)] lg:gap-14">
            <div className="rounded-2xl border border-[#e5ebf5] bg-white p-5 shadow-sm sm:p-8">
              <ContactForm />
            </div>

            <aside className="space-y-8 lg:pt-2">
              <div className="flex gap-4">
                <div className="mt-0.5 shrink-0">{IconMail()}</div>
                <div>
                  <h2 className="text-base font-semibold text-[#0f2a3d]">Office contact</h2>
                  <p className="mt-1 text-sm text-[#5b6b85]">
                    NAVTTC Job Portal Support Team
                  </p>
                  <a
                    href="mailto:info.reg@navttc.gov.pk"
                    className="mt-1 inline-block text-sm font-medium text-[#2f4d9a] hover:underline"
                  >
                    info.reg@navttc.gov.pk
                  </a>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5 shrink-0">{IconPhone()}</div>
                <div>
                  <h2 className="text-base font-semibold text-[#0f2a3d]">Call us</h2>
                  <p className="mt-1 text-sm text-[#5b6b85]">Mon–Fri from 9am to 5pm</p>
                  <p className="mt-1 text-sm font-medium text-[#1b2a4a]">0800-88866</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5 shrink-0">{IconClock()}</div>
                <div>
                  <h2 className="text-base font-semibold text-[#0f2a3d]">Office Hours</h2>
                  <p className="mt-1 text-sm text-[#5b6b85]">Monday – Friday: 9:00 AM – 5:00 PM</p>
                </div>
              </div>

              <div className="flex gap-4">
                <div className="mt-0.5 shrink-0">{IconPin()}</div>
                <div>
                  <h2 className="text-base font-semibold text-[#0f2a3d]">Visit us</h2>
                  <p className="mt-1 text-xs font-medium uppercase tracking-wide text-[#6b7c99]">
                    Office address
                  </p>
                  <p className="mt-1 text-sm leading-relaxed text-[#5b6b85]">
                    National Vocational &amp; Technical Training Commission (NAVTTC)
                    <br />
                    Plot No. 38, Kirthar Road, Sector H-9/4
                    <br />
                    Islamabad, Pakistan
                  </p>
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>

      <LandingFooter />
    </div>
  );
}
