import Link from "next/link";
import { ScrollToTop } from "@/components/layout/ScrollToTop";

export function LandingFooter() {
  return (
    <>
    <footer id="contact" className="border-t border-[#e5ebf5] bg-[#1b2a4a] text-white">
      <div className="mx-auto grid max-w-[1200px] gap-8 px-4 py-10 sm:px-6 md:grid-cols-2 lg:grid-cols-4">
        <div>
          <h3 className="text-sm font-semibold">About NAVTTC</h3>
          <ul className="mt-3 space-y-2 text-xs text-white/80">
            <li>
              <Link href="/about" className="hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link href="/about" className="hover:text-white">
                Vision and Mission
              </Link>
            </li>
            <li>
              <a href="#seeker-guide" className="hover:text-white">
                Our Services
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Job Seeker Resources</h3>
          <ul className="mt-3 space-y-2 text-xs text-white/80">
            <li>
              <a href="#jobs" className="hover:text-white">
                Find Jobs
              </a>
            </li>
            <li>
              <Link href="/register" className="hover:text-white">
                Register as Job Seeker
              </Link>
            </li>
            <li>
              <Link href="/career-advisors" className="hover:text-white">
                Career Counselling
              </Link>
            </li>
            <li>
              <a href="#seeker-guide" className="hover:text-white">
                How to Apply
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Employer Resources</h3>
          <ul className="mt-3 space-y-2 text-xs text-white/80">
            <li>
              <Link href="/register" className="hover:text-white">
                Employer Registration
              </Link>
            </li>
            <li>
              <Link href="/login" className="hover:text-white">
                Post a Job
              </Link>
            </li>
            <li>
              <a href="#employer-guide" className="hover:text-white">
                Find Talent
              </a>
            </li>
            <li>
              <a href="#employers" className="hover:text-white">
                Trusted Employers
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold">Quick Links & Contact</h3>
          <ul className="mt-3 space-y-2 text-xs text-white/80">
            <li>
              <Link href="/contact" className="hover:text-white">
                Contact Us
              </Link>
            </li>
            <li>
              <Link href="/events" className="hover:text-white">
                Upcoming Events
              </Link>
            </li>
            <li>
              <a href="#news" className="hover:text-white">
                Latest News
              </a>
            </li>
            <li>
              <Link href="/success-stories" className="hover:text-white">
                Success Stories
              </Link>
            </li>
            <li>
              <span className="text-white/90">0800-88866</span>
            </li>
            <li>
              <span className="text-white/90">info.reg@navttc.gov.pk</span>
            </li>
            <li>
              <Link href="/login" className="text-white/60 hover:text-white">
                Admin Login
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-2 px-4 py-4 text-[11px] text-white/60 sm:flex-row sm:items-center sm:justify-between sm:px-6">
          <p>Copyright © {new Date().getFullYear()} NAVTTC Job Portal Management System</p>
          <div className="flex gap-4">
            <span>Privacy Policy</span>
            <span>Terms and Conditions</span>
          </div>
        </div>
      </div>
    </footer>
    <ScrollToTop />
    </>
  );
}
